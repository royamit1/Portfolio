import asyncio
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import AgentExecutor, create_openai_tools_agent, Tool
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_core.runnables import RunnableConfig
from pydantic import BaseModel, Field
from app.core.config import settings
from app.services.contact_service import send_email_tool
from app.services.chatbot_service import stateless_rag_chain
from app.models.tool import KnowledgeBaseToolInput, ResumeEmailToolInput

# --- 1. Setup ---
# --- UPDATED: Added max_tokens to limit output length ---
llm = ChatOpenAI(
    api_key=settings.OPENAI_API_KEY.get_secret_value(),
    model="gpt-4-turbo",
    temperature=0,
    max_tokens=1000  # Hard limit on the response length
)


# --- 2. Tool Functions & Tool Creation (No Changes) ---
def send_resume_email(recipient: str) -> str:
    subject = "Roy Amit's Resume"
    body = "<p>Hello,</p><p>Thank you for your interest in Roy's profile.</p><p>You can view or download his resume using this link: [Your Resume Link Here].</p><p>Best regards,</p><p>Roy's AI Assistant</p>"
    try:
        asyncio.run(send_email_tool(recipient=recipient, subject=subject, body=body))
        return f"Successfully sent email to {recipient}."
    except Exception as e:
        return f"Error: Failed to send email. Reason: {e}"


rag_tool = Tool(
    name="PortfolioKnowledgeBase",
    func=stateless_rag_chain.invoke,
    description="MANDATORY: Use this tool for any and all questions about Roy Amit's skills, projects, experience, education, or other professional information.",
    args_schema=KnowledgeBaseToolInput
)

resume_email_tool = Tool(
    name="SendResumeEmail",
    func=send_resume_email,
    description="Use this tool only when a user explicitly asks for a copy of Roy's resume to be sent to their email.",
    args_schema=ResumeEmailToolInput
)

tools = [rag_tool, resume_email_tool]

# --- 3. Create the Agent ---
agent_prompt_template = """You are Roy Amit, a professional AI assistant for a software developer's portfolio.
Your mission is to help users learn about Roy's professional profile and assist them with their requests.

**Your Process:**
1.  First, determine the user's intent. Are they asking a question about Roy, or are they asking you to perform an action?
2.  If they are asking a question about Roy, you MUST use the `PortfolioKnowledgeBase` tool.
3.  If they are asking you to send the resume, you MUST use the `SendResumeEmail` tool.
4.  Do not answer any questions from your own general knowledge. You must use your tools.
5.  If a question is not related to Roy's portfolio or your available tools, politely decline by responding with: "I can only assist with inquiries related to Roy Amit's professional portfolio."
"""

agent_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", agent_prompt_template),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ]
)

agent = create_openai_tools_agent(llm, tools, agent_prompt)

# --- UPDATED: Added max_iterations as a safety net ---
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    handle_parsing_errors=True,
    max_iterations=5  # Prevents the agent from getting stuck in a loop
)


# --- 4. Session History and Memory (No Changes) ---
def get_session_history(session_id: str) -> RedisChatMessageHistory:
    return RedisChatMessageHistory(session_id, url=settings.REDIS_URL)


agent_with_chat_history = RunnableWithMessageHistory(
    agent_executor,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="output",
)


# --- 5. Streaming Function (No Changes) ---
async def stream_agent_response(message: str, session_id: str):
    config = RunnableConfig(configurable={"session_id": session_id})
    async for chunk in agent_with_chat_history.astream({"input": message}, config=config):
        if "output" in chunk:
            yield chunk["output"]
