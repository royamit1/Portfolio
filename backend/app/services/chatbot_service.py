from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.runnables import RunnableLambda
from app.core.config import settings
from app.services.rag_service import get_retriever

WINDOW_SIZE = 4

llm = ChatOpenAI(api_key=settings.OPENAI_API_KEY.get_secret_value(), model="gpt-3.5-turbo", temperature=0)

SYSTEM_PROMPT = """You are Roy Amit, a junior full-stack developer, and you are speaking to a recruiter or fellow developer who is visiting your portfolio website.
Your goal is to answer questions about your skills, projects, and professional experience in a friendly and professional manner.

Speak as Roy, using 'I' and 'my'.

Use the following retrieved context to answer the user's question. If the context is empty or irrelevant, politely say that you don't have that information.
Do not make up information.

--- CONTEXT ---
{context}
--- END CONTEXT ---
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

output_parser = StrOutputParser()


def trim_messages(chain_input):
    messages = chain_input.get("chat_history", [])
    if len(messages) > WINDOW_SIZE * 2:
        chain_input["chat_history"] = messages[-(WINDOW_SIZE * 2):]
    return chain_input


retriever = get_retriever()


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


rag_chain = (
        {
            "context": RunnableLambda(lambda x: x["input"]) | retriever | format_docs,
            "input": lambda x: x["input"],
            "chat_history": lambda x: x["chat_history"]
        }
        | prompt
        | llm
        | output_parser
)

core_chain = RunnableLambda(trim_messages) | rag_chain

store = {}


def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]


chain_with_memory = RunnableWithMessageHistory(
    core_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
)


async def stream_chatbot_response(message: str, session_id: str):
    """
    Uses .astream() to get a stream of response chunks from the chatbot.
    This is an asynchronous generator.
    """
    async for chunk in chain_with_memory.astream(
            {"input": message},
            config={
                "configurable": {"session_id": session_id}
            }
    ):
        yield chunk
