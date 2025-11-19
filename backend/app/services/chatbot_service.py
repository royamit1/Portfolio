from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.core.config import settings
from app.services.rag_service import get_retriever

# Global variable to cache the chain
_rag_chain = None


def format_docs(docs):
    """
    Converts a list of retrieved documents into a single string,
    including metadata for better context tracking.
    """
    formatted_docs = []
    for doc in docs:
        # Extract source filename if available, default to 'unknown'
        source = doc.metadata.get("source", "unknown")
        formatted_docs.append(f"Source: {source}\nContent: {doc.page_content}")

    return "\n\n".join(formatted_docs)


def get_stateless_rag_chain():
    """
    Lazily instantiates the RAG chain.
    """
    global _rag_chain
    if _rag_chain is not None:
        return _rag_chain

    # --- 1. Setup ---
    llm = ChatOpenAI(
        api_key=settings.OPENAI_API_KEY.get_secret_value(),
        model="gpt-4o-mini",
        temperature=0
    )

    retriever = get_retriever()

    # --- 2. Define the Stateless RAG Chain ---
    # Refined prompt with list formatting instructions
    rag_prompt_template = """You are an assistant for question-answering tasks representing Roy Amit.
Use the following pieces of retrieved context to answer the question.
If the context does not contain the answer, say "I don't have that information in my knowledge base."

**Formatting Rules:**
1. If the answer comprises multiple items, strictly use a **bulleted list** format.
2. Use three sentences maximum for narrative answers.
3. Keep the answer concise and professional.

--- CONTEXT ---
{context}
--- END CONTEXT ---

Question: {question}
"""
    rag_prompt = ChatPromptTemplate.from_template(rag_prompt_template)

    # Construct the chain
    _rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | rag_prompt
            | llm
            | StrOutputParser()
    )

    return _rag_chain
