import json
import logging
from typing import AsyncGenerator

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools import Tool
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import RedisChatMessageHistory

from app.core.config import settings
from app.schemas import KnowledgeBaseToolInput, ResumeEmailToolInput
from app.services.contact_service import send_email_tool
from app.services.rag_service import get_retriever

logger = logging.getLogger(__name__)

# --- Configuration & Prompts ---

TOOL_DISPLAY_NAMES = {
    "PortfolioKnowledgeBase": "Searching knowledge base",
    "SendResumeEmail": "Sending resume email"
}

AGENT_SYSTEM_PROMPT = f"""You are the AI Portfolio Representative for {settings.PORTFOLIO_OWNER}.
You are a professional, helpful, and knowledgeable assistant.
You represent {settings.PORTFOLIO_OWNER} professionally based **ONLY** on the information retrieved from your tools.

**CRITICAL IDENTITY & LANGUAGE RULES:**
1.  **"YOUR" = "{settings.PORTFOLIO_OWNER.upper()}'S":** If a user asks about "your" skills, "your" projects, or "your" resume, they are asking about **{settings.PORTFOLIO_OWNER}**.
    -   *Incorrect:* "I am an AI and do not have a resume."
    -   *Correct:* "I can certainly share details from {settings.PORTFOLIO_OWNER}'s resume."
    -   **EXCEPTION:** If the user explicitly asks "Are you a bot?", "Who are you?", or "Who made you?", answer as the AI Assistant.
2.  **NO "TOOL" TALK:** Never mention "tools", "databases", "retrieved documents", or "context". Present information naturally.
3.  **FORMATTING:** Use **Markdown** (bolding, lists) to make long answers readable.

**CRITICAL ANTI-HALLUCINATION RULES:**
1.  **MISSING ARGUMENTS:** If a tool requires an argument (like `recipient` for email) and the user hasn't provided it, you must **ASK** the user for it. NEVER invent a placeholder.
2.  **STRICT GROUNDING:** If the tool output is empty or irrelevant, simply state: "I don't have that specific information about {settings.PORTFOLIO_OWNER}'s background." Do not make things up.

**DECISION LOGIC (HOW TO CHOOSE TOOLS):**

1.  **Resume Summary / Content Requests:**
    -   **Triggers:** "Tell me about your resume", "What is on your CV?", "Do you have a resume?".
    -   **ACTION:** Call `PortfolioKnowledgeBase` with the query "{settings.PORTFOLIO_OWNER} resume summary experience skills".
    -   **RESPONSE:** Provide a structured summary. **ALWAYS** end by asking: *"Would you like me to email you the full PDF?"*

2.  **Resume Email Requests:**
    -   **Triggers:** "Send me the resume", "Email me the CV", "Yes" (specifically in response to the email offer).    
    -   **Condition A (Email IS provided):** Call `SendResumeEmail` with the email.
    -   **Condition B (Email IS MISSING):** Reply: "I'd be happy to send it. What is your email address?" (DO NOT call the tool).

3.  **Project / Portfolio Requests:**
    -   **Triggers:** "What projects has he built?", "Tell me about [Project Name]", "Tech Stack".
    -   **ACTION:** Call `PortfolioKnowledgeBase`.
    -   **QUERY STRATEGY:** If the user asks about a specific project, include that name in the query (e.g., "{settings.PORTFOLIO_OWNER} SpaceEase details"). If generic, use "{settings.PORTFOLIO_OWNER} projects and tech stack".

4.  **Bio / Background Requests:**
    -   **Triggers:** "Tell me about yourself", "Who is {settings.PORTFOLIO_OWNER}?", "Professional background".
    -   **ACTION:** Call `PortfolioKnowledgeBase` with "{settings.PORTFOLIO_OWNER} professional background".
    -   **INTERPRETATION:** Interpret "Tell me about yourself" as a request for {settings.PORTFOLIO_OWNER}'s background, NOT the AI's background.

5.  **Identity Questions:**
    -   **Triggers:** "Who are you?", "Are you real?".
    -   **Answer:** "I am {settings.PORTFOLIO_OWNER}'s AI Portfolio Assistant, here to answer questions about their work and experience."

**Your Persona:**
- **Tone:** Professional yet approachable. Friendly, but business-focused.
- **Style:** Conversational. Avoid stiff corporate jargon. Speak naturally.

**RESPONSE GUIDELINES (How to be Concise & Informative):**
1.  **ADAPTIVE FORMATTING:** -   Use **short paragraphs** (2-3 sentences) for biographical or conversational answers to keep it feeling like a chat.
    -   Use **bullet points** ONLY when listing multiple items (e.g., tech stacks, project features) to ensure readability.
    -   *Never* output a "wall of text."

2.  **PIVOT TO IMPACT (Crucial):**
    -   When mentioning a skill or project, do not just name it. Briefly mention the **achievement** or **advantage**.
    -   *Bad:* "Roy knows Android and C#."
    -   *Good:* "Roy specializes in Android and C#, which he used to build a high-performance video calling system that offloaded processing to the GPU."

3.  **NO FLUFF:**
    -   Get straight to the answer. Do not start with "That is a great question" or "I can certainly help with that."
    -   If the answer is simple, keep it simple.
"""


# --- Tool Implementations ---

async def rag_tool_wrapper(question: str) -> str:
    """Retrieves portfolio information from the vector database."""
    try:
        retriever = get_retriever()
        docs = await retriever.ainvoke(question)

        if not docs:
            return "No relevant information found in the portfolio documents."

        return "\n\n".join([doc.page_content for doc in docs])
    except Exception as e:
        logger.error(f"RAG Tool Error: {e}", exc_info=True)
        return "Error retrieving information. Please try again."


async def send_resume_email(recipient: str) -> str:
    """Sends the resume email via the configured mail service."""
    subject = f"{settings.PORTFOLIO_OWNER}'s Resume"

    # We construct the HTML body here to keep the service logic self-contained
    body = f"""
            <p>Hello,</p>
            <p>Thank you for your interest in {settings.PORTFOLIO_OWNER}'s profile.</p>
            <p>You can view and download the resume here:</p>
            <p>
                <a href="{settings.RESUME_LINK}" 
                   style="background-color:#4F46E5; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
                   View Resume PDF
                </a>
            </p>
            <br>
            <p>Best regards,</p>
            <p>{settings.PORTFOLIO_OWNER}'s AI Assistant</p>
        """

    try:
        await send_email_tool(recipient=recipient, subject=subject, body=body)
        logger.info(f"Resume sent to {recipient}")
        return f"Successfully sent email to {recipient}."
    except Exception as e:
        logger.error(f"Email Tool Error: {e}", exc_info=True)
        return f"Error sending email: {str(e)}"


# --- Agent Setup ---

# Initialize LLM with temperature=0 to ensure factual responses based on RAG data
llm = ChatOpenAI(
    api_key=settings.OPENAI_API_KEY.get_secret_value(),
    model=settings.OPENAI_MODEL,
    temperature=0,
    max_tokens=500
)

# Define tools with Schema validation
rag_tool = Tool(
    name="PortfolioKnowledgeBase",
    func=None,
    coroutine=rag_tool_wrapper,
    description=(
        f"Use this tool to search {settings.PORTFOLIO_OWNER}'s portfolio. "
        "CRITICAL: Do not just pass the user's raw message. "
        f"1. Replace pronouns (he/him/you) with '{settings.PORTFOLIO_OWNER}'. "
        "2. Focus on keywords (skills, projects, education). "
        f"Example: If user asks 'Does he know React?', input should be '{settings.PORTFOLIO_OWNER} React experience'."
    ),
    args_schema=KnowledgeBaseToolInput
)

resume_email_tool = Tool(
    name="SendResumeEmail",
    func=None,
    coroutine=send_resume_email,
    description=f"Use this tool only when a user explicitly asks for a copy of {settings.PORTFOLIO_OWNER}'s resume.",
    args_schema=ResumeEmailToolInput
)

tools = [rag_tool, resume_email_tool]

agent_prompt = ChatPromptTemplate.from_messages([
    ("system", AGENT_SYSTEM_PROMPT),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])

agent = create_openai_tools_agent(llm, tools, agent_prompt)

# Executor handles the agent-tool loop.
# handle_parsing_errors=True allows the agent to recover if it outputs invalid JSON.
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=False,
    handle_parsing_errors=True,
    max_iterations=5
)


# --- Streaming Logic ---

def get_session_history(session_id: str) -> RedisChatMessageHistory:
    return RedisChatMessageHistory(session_id, url=settings.REDIS_URL)


agent_with_chat_history = RunnableWithMessageHistory(
    agent_executor,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history"
)


def format_sse_event(event_type: str, data: dict) -> str:
    """Formats data into Server-Sent Events (SSE) protocol string."""
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"


async def stream_agent_response(message: str, session_id: str) -> AsyncGenerator[str, None]:
    """
    Orchestrates the agent interaction and streams events to the client.
    Handles tool status updates and text tokens separately.
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
            data = event.get("data", {})

            # Notify frontend when a tool starts
            if kind == "on_tool_start" and name in TOOL_DISPLAY_NAMES:
                display_name = TOOL_DISPLAY_NAMES.get(name, name)
                yield format_sse_event("tool_start", {"tool": name, "message": f"🔍 {display_name}..."})

            # Notify frontend when a tool finishes
            elif kind == "on_tool_end" and name in TOOL_DISPLAY_NAMES:
                output = str(data.get("output", ""))
                is_error = not output or "Error" in output
                status_msg = "⚠️ Could not find specific details." if is_error else "✅ Found relevant information"

                yield format_sse_event("tool_end", {"tool": name, "message": status_msg})

            # Stream the actual text response from the LLM
            elif kind == "on_chat_model_stream":
                chunk = data.get("chunk")
                if chunk and getattr(chunk, "content", ""):
                    yield format_sse_event("token", {"content": chunk.content})

    except Exception as e:
        logger.error(f"Stream Agent Error: {e}", exc_info=True)
        yield format_sse_event("error", {"message": "❌ Sorry, an unexpected system error occurred."})

    finally:
        yield format_sse_event("done", {"message": "[DONE]"})
