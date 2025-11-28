from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools import Tool
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import RedisChatMessageHistory
from app.core.config import settings
from app.services.contact_service import send_email_tool
from app.services.rag_service import get_retriever
from app.models.tool import KnowledgeBaseToolInput, ResumeEmailToolInput
import json
import logging

logger = logging.getLogger(__name__)

# --- 1. Setup ---
llm = ChatOpenAI(
    api_key=settings.OPENAI_API_KEY.get_secret_value(),
    model="gpt-4-turbo",
    temperature=0,
    max_tokens=1500
)


# --- 2. Define Tool Functions ---
async def rag_tool_wrapper(question: str):
    """Gets the retriever and invokes it with the user's question."""
    retriever = get_retriever()
    return await retriever.ainvoke(question)


async def send_resume_email(recipient: str) -> str:
    subject = "Roy Amit's Resume"
    # FULL, UNTRUNCATED BODY
    body = """
    <p>Hello,</p>
    <p>Thank you for your interest in Roy's profile.</p>
    <p>You can view or download his resume using this link: [Your Resume Link Here].</p>
    <p>Best regards,</p>
    <p>Roy's AI Assistant</p>
    """
    try:
        await send_email_tool(recipient=recipient, subject=subject, body=body)
        return f"Successfully sent email to {recipient}."
    except Exception as e:
        return f"Error: {e}"


# --- 3. Create Tools ---
rag_tool = Tool(
    name="PortfolioKnowledgeBase",
    func=None,
    coroutine=rag_tool_wrapper,
    description=(
        "Use this tool to search Roy's portfolio. "
        "CRITICAL: Do not just pass the user's raw message. "
        "1. Replace pronouns (he/him/you) with 'Roy Amit'. "
        "2. Focus on keywords (skills, projects, education). "
        "Example: If user asks 'Does he know React?', input should be 'Roy Amit React experience'."
    ),
    args_schema=KnowledgeBaseToolInput
)

resume_email_tool = Tool(
    name="SendResumeEmail",
    func=None,
    coroutine=send_resume_email,
    description="Use this tool only when a user explicitly asks for a copy of Roy's resume.",
    args_schema=ResumeEmailToolInput
)

tools = [rag_tool, resume_email_tool]
TOOL_DISPLAY_NAMES = {"PortfolioKnowledgeBase": "Searching knowledge base", "SendResumeEmail": "Sending resume email"}

# --- 4. THE DEFINITIVE AGENT PROMPT ---
# FULL, UNTRUNCATED PROMPT
agent_prompt_template = """You are the AI Portfolio Representative for Roy Amit.
You represent Roy professionally based **ONLY** on the information provided in the 'tool_output' section.

**CRITICAL ANTI-HALLUCINATION RULE:**
You must **NEVER** invent, infer, or guess any information, skills, or experiences that are not explicitly present in the retrieved context from your tools. If the information is not in the context, you MUST state that you do not have information on that topic.

**DECISION LOGIC (IDENTITY VS. SUBJECT):**
1.  **"Who are you?":** -   If the user asks "Who are you?", "Are you a robot?", or "Who made you?", answer: "I am Roy Amit's AI Portfolio Assistant."
2.  **"Tell me about Roy" / "Who is Roy?":** -   You **MUST** use the `PortfolioKnowledgeBase` tool.
    -   Do **NOT** answer "I am Roy's Assistant" to these questions. The user wants to know about Roy, not you.
3.  **"Tell me about yourself":**
    -   Interpret this as a standard job interview question directed at **Roy**.
    -   You **MUST** use the `PortfolioKnowledgeBase` tool to retrieve Roy's bio and answer as if representing him.

**Your Process:**
1.  Analyze the user's question based on the Decision Logic above.
2.  Use the `PortfolioKnowledgeBase` tool to retrieve relevant documents for ANY question about Roy's skills, projects, experience, or background.
3.  You will be given the output of that tool. This is your source of truth.
4.  Synthesize the information from the tool output into a helpful, conversational, and professional answer. Do not just repeat the text.
5.  If the tool output is empty or does not contain the answer, state that you don't have the information.

**Your Persona:**
- **Tone:** Professional, confident, and helpful. Prioritize ACCURACY above all.
"""

agent_prompt = ChatPromptTemplate.from_messages([
    ("system", agent_prompt_template),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])

agent = create_openai_tools_agent(llm, tools, agent_prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True, max_iterations=5)


# --- 5. Session History & Streaming ---
def get_session_history(session_id: str) -> RedisChatMessageHistory:
    return RedisChatMessageHistory(session_id, url=settings.REDIS_URL)


agent_with_chat_history = RunnableWithMessageHistory(agent_executor, get_session_history, input_messages_key="input",
                                                     history_messages_key="chat_history")


def format_sse_event(event_type: str, data: dict) -> str:
    json_data = json.dumps(data)
    return f"event: {event_type}\ndata: {json_data}\n\n"


async def stream_agent_response(message: str, session_id: str):
    config = {"configurable": {"session_id": session_id}}
    try:
        async for event in agent_with_chat_history.astream_events({"input": message}, config=config, version="v2"):
            kind = event["event"]
            name = event.get("name", "")
            data = event.get("data", {})

            if kind == "on_tool_start" and name in TOOL_DISPLAY_NAMES:
                display_name = TOOL_DISPLAY_NAMES.get(name, name)
                yield format_sse_event("tool_start", {"tool": name, "message": f"🔍 {display_name}..."})
            elif kind == "on_tool_end" and name in TOOL_DISPLAY_NAMES:
                output = str(data.get("output", ""))
                if not output or "Error" in output:
                    yield format_sse_event("tool_end", {"tool": name, "message": "⚠️ Could not find specific details."})
                else:
                    yield format_sse_event("tool_end", {"tool": name, "message": "✅ Found relevant information"})
            elif kind == "on_chat_model_stream":
                chunk = data.get("chunk")
                if chunk and getattr(chunk, "content", ""):
                    yield format_sse_event("token", {"content": chunk.content})
    except Exception as e:
        logger.error(f"Stream error: {e}", exc_info=True)
        yield format_sse_event("error", {"message": "❌ Sorry, an unexpected error occurred."})
    finally:
        yield format_sse_event("done", {"message": "[DONE]"})
