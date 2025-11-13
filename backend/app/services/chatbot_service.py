import os
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from app.core.config import settings
from app.services.rag_service import get_retriever
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

# --- 1. Setup ---
llm = ChatOpenAI(api_key=settings.OPENAI_API_KEY.get_secret_value(), model="gpt-3.5-turbo", temperature=0)
retriever = get_retriever()

# --- 2. Create the History-Aware Question Rewriter Chain ---
history_rewriter_prompt_template = """Given a chat history and the latest user question \
which might reference context in the chat history, formulate a standalone question \
which can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed and otherwise return it as is."""

history_rewriter_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", history_rewriter_prompt_template),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

history_aware_retriever_chain = create_history_aware_retriever(
    llm, retriever, history_rewriter_prompt
)

# --- 3. Create the Document-Based Answer Generation Chain ---
# --- UPDATED PROMPT ---
answer_generator_prompt_template = """You are Roy Amit, a junior full-stack developer. \
Your goal is to answer questions about your skills, projects, and professional experience.

Speak as Roy, using 'I' and 'my'.

Synthesize a helpful and friendly answer based on the user's question and the provided context. \
The user's question might contain specific constraints from the conversation history. \
Prioritize the user's immediate question and its constraints when formulating the answer.

Use the retrieved context below to ground your answer in facts. If the context is not relevant to the question, \
politely say that you don't have that information. Do not make up information.

--- CONTEXT ---
{context}
--- END CONTEXT ---
"""

answer_generator_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", answer_generator_prompt_template),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

answer_generation_chain = create_stuff_documents_chain(llm, answer_generator_prompt)

# --- 4. Create the Final Conversational RAG Chain ---
conversational_rag_chain = create_retrieval_chain(history_aware_retriever_chain, answer_generation_chain)


# --- 5. Session History and Memory Management ---
def get_session_history(session_id: str) -> RedisChatMessageHistory:
    return RedisChatMessageHistory(session_id, url=settings.REDIS_URL)


chain_with_memory = RunnableWithMessageHistory(
    conversational_rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
)


# --- 6. Streaming Function ---
async def stream_chatbot_response(message: str, session_id: str):
    async for chunk in chain_with_memory.astream(
            {"input": message},
            config={"configurable": {"session_id": session_id}},
    ):
        if "answer" in chunk:
            yield chunk["answer"]
