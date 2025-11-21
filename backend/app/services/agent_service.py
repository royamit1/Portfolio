from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools import Tool
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import RedisChatMessageHistory
from app.core.config import settings
from app.services.contact_service import send_email_tool
from app.services.chatbot_service import get_stateless_rag_chain
from app.models.tool import KnowledgeBaseToolInput, ResumeEmailToolInput
import json

# --- 1. Setup ---
llm = ChatOpenAI(
    api_key=settings.OPENAI_API_KEY.get_secret_value(),
    model="gpt-4-turbo",
    temperature=0,
    max_tokens=1000
)


# --- 2. Define Tool Functions ---

async def send_resume_email(recipient: str) -> str:
    """Sends a pre-defined email containing Roy Amit's resume."""
    subject = "Roy Amit's Resume"
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
        return f"Error: Failed to send email. Reason: {e}"


async def rag_tool_wrapper(question: str) -> str:
    """Async wrapper for the stateless RAG chain."""
    if not question:
        return "Error: No question provided."
    chain = get_stateless_rag_chain()
    return await chain.ainvoke(question)


# --- 3. Create Tools ---
rag_tool = Tool(
    name="PortfolioKnowledgeBase",
    func=None,
    coroutine=rag_tool_wrapper,
    # Improved description to handle follow-up context
    description="MANDATORY: Use this tool for questions about Roy Amit. "
                "IMPORTANT: If the user asks a follow-up question (e.g., 'tell me more about that'), "
                "you MUST rephrase the question to include the specific topic from the previous message "
                "before calling this tool. (e.g., convert 'tell me more about it' to 'tell me more about Python').",
    args_schema=KnowledgeBaseToolInput
)

resume_email_tool = Tool(
    name="SendResumeEmail",
    func=None,
    coroutine=send_resume_email,
    description="Use this tool only when a user explicitly asks for a copy of Roy's resume to be sent to their email.",
    args_schema=ResumeEmailToolInput
)

tools = [rag_tool, resume_email_tool]

# --- 4. Tool Display Names (User-Friendly) ---
TOOL_DISPLAY_NAMES = {
    "PortfolioKnowledgeBase": "Searching knowledge base",
    "SendResumeEmail": "Sending resume email",
}

# --- 5. Create the Agent ---
agent_prompt_template = """You are the AI Portfolio Assistant for Roy Amit, a professional software developer.
Your goal is to represent Roy professionally and answer questions about his background, skills, and projects.

**Decision Logic & Rules:**

1.  **Identity & Greetings:** - If the user asks "Who are you?", "What is your name?", or simply greets you ("Hello"), answer directly using your persona. You do NOT need a tool for this.
    - Example: "I am Roy Amit's AI assistant. I can tell you about his projects, skills, and experience."

2.  **Roy's Information (The "You" Mapping):**
    - Interpret questions like "What are **your** skills?", "Tell me about **your** projects", or "What is **your** experience?" as referring to **Roy Amit**.
    - For ALL such questions, you MUST use the `PortfolioKnowledgeBase` tool.

3.  **Resume Requests:**
    - If the user asks for a resume, use the `SendResumeEmail` tool.
    - If you don't have the email address, ask for it first.

4.  **Strict Scope:**
    - Do NOT answer general trivia, math, or world knowledge questions (e.g., "What is the capital of France?").
    - If a question is unrelated to Roy's portfolio, politely decline: "I can only assist with inquiries related to Roy Amit's professional portfolio."
"""

agent_prompt = ChatPromptTemplate.from_messages([
    ("system", agent_prompt_template),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])

agent = create_openai_tools_agent(llm, tools, agent_prompt)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    handle_parsing_errors=True,
    max_iterations=5
)


# --- 6. Session History and Memory ---
def get_session_history(session_id: str) -> RedisChatMessageHistory:
    # [POLISH] Use the centralized config property
    return RedisChatMessageHistory(session_id, url=settings.REDIS_URL)


agent_with_chat_history = RunnableWithMessageHistory(
    agent_executor,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="output",
)


# --- 7. SSE Event Helpers ---
def format_sse_event(event_type: str, data: dict) -> str:
    """Formats a Server-Sent Event string."""
    json_data = json.dumps(data)
    return f"event: {event_type}\ndata: {json_data}\n\n"


# --- 8. Streaming Function with SSE Events ---
async def stream_agent_response(message: str, session_id: str):
    """
    Streams agent response using astream_events API.
    Yields SSE-formatted events for tool usage and final answer tokens.
    """
    config = {"configurable": {"session_id": session_id}}

    try:
        async for event in agent_with_chat_history.astream_events(
                {"input": message},
                config=config,
                version="v2"
        ):
            kind = event["event"]
            name = event.get("name", "")
            tags = event.get("tags", [])

            # --- FILTERING LOGIC ---
            # Ignore any events generated by the internal RAG chain
            if "inner_rag" in tags:
                continue

            # Tool Start - Agent decided to use a tool
            if kind == "on_tool_start":
                if name in TOOL_DISPLAY_NAMES:
                    display_name = TOOL_DISPLAY_NAMES.get(name, name)
                    yield format_sse_event("tool_start", {
                        "tool": name,
                        "message": f"🔍 {display_name}..."
                    })

            # Tool End - Tool finished executing
            elif kind == "on_tool_end":
                if name in TOOL_DISPLAY_NAMES:
                    yield format_sse_event("tool_end", {
                        "tool": name,
                        "message": "✅ Found relevant information"
                    })

            # LLM Token Streaming
            elif kind == "on_chat_model_stream":
                # Check if this is the top-level agent speaking
                chunk = event.get("data", {}).get("chunk")
                if chunk:
                    content = getattr(chunk, "content", "")
                    if content:
                        yield format_sse_event("token", {
                            "content": content
                        })

        # Signal stream completion
        yield format_sse_event("done", {})

    except Exception as e:
        # Yield error event so frontend can display it
        yield format_sse_event("error", {
            "message": "❌ Sorry, an unexpected error occurred. Please try again."
        })
        print(f"Stream error: {e}")
