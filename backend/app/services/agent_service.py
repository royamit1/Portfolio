from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import AgentExecutor, create_openai_tools_agent, Tool
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import RedisChatMessageHistory
from app.core.config import settings
from app.services.contact_service import send_email_tool
from app.models.tool import EmailToolInput
from app.services.chatbot_service import conversational_rag_chain

# --- 1. Setup ---
llm = ChatOpenAI(api_key=settings.OPENAI_API_KEY.get_secret_value(), model="gpt-4-turbo", temperature=0)

# --- 2. Define Tools ---
rag_tool = Tool(
    name="portfolio_knowledge_base",
    func=conversational_rag_chain.invoke,
    description="MANDATORY: Use this for any and all questions regarding Roy Amit's skills, projects, experience, or other professional information. This is your only source of knowledge."
)

email_tool = Tool(
    name="send_email",
    func=send_email_tool,
    description="Use this only when a user explicitly asks to send an email and provides a recipient email address.",
    args_schema=EmailToolInput,
)

tools = [rag_tool, email_tool]

# --- 3. Create the Agent with a Stricter Prompt ---
agent_prompt_template = """You are a professional AI assistant for the portfolio of Roy Amit. Your name is Roy Amit.
Your ONLY purpose is to answer questions about Roy's professional profile and to perform actions like sending emails when requested.

You MUST use the 'portfolio_knowledge_base' tool to answer any question about Roy.
Do NOT engage in general conversation, small talk, or answer questions about any other topic.

If a user asks a question that is not about Roy's portfolio and is not a request to perform an action, you MUST respond with:
"I can only answer questions about Roy Amit's professional portfolio. Please ask me about his skills, projects, or experience."

If the 'portfolio_knowledge_base' tool does not provide a relevant answer, state that you do not have that information.
Do not make up information.
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
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# --- 4. Session History and Memory ---
def get_session_history(session_id: str) -> RedisChatMessageHistory:
    return RedisChatMessageHistory(session_id, url=settings.REDIS_URL)

agent_with_chat_history = RunnableWithMessageHistory(
    agent_executor,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="output",
)

# --- 5. Streaming Function ---
async def stream_agent_response(message: str, session_id: str):
    async for chunk in agent_with_chat_history.astream(
        {"input": message},
        config={"configurable": {"session_id": session_id}},
    ):
        if "output" in chunk:
            yield chunk["output"]
