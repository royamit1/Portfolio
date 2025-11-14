from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.core.config import settings
from app.services.rag_service import get_retriever

# This file now defines the logic for a stateless RAG chain,
# which will be used as a tool by the main agent.

# --- 1. Setup ---
llm = ChatOpenAI(api_key=settings.OPENAI_API_KEY.get_secret_value(), model="gpt-3.5-turbo", temperature=0)
retriever = get_retriever()

# --- 2. Define the Stateless RAG Chain ---

# This prompt is simple. It only takes context (from the retriever) and a question.
# It does NOT know about chat history.
rag_prompt_template = """You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.

--- CONTEXT ---
{context}
--- END CONTEXT ---

Question: {question}
"""

rag_prompt = ChatPromptTemplate.from_template(rag_prompt_template)


def format_docs(docs):
    """Converts a list of retrieved documents into a single string."""
    return "\n\n".join(doc.page_content for doc in docs)


# This is the complete, stateless RAG chain.
# It takes a question, retrieves documents, formats them, and generates an answer.
stateless_rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | rag_prompt
        | llm
        | StrOutputParser()
)
