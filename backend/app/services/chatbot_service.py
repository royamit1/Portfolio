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
    rag_prompt_template = """You are the specific knowledge base for Roy Amit.
    You are NOT a generic AI assistant. You strictly answer questions based ONLY on the provided context below.

    **Rules:**
    1. The user usually asks "What are your skills?" or "Tell me about yourself". ALWAYS interpret "you" or "your" as referring to **Roy Amit**, not the AI.
    2. If the answer is NOT in the context, strictly state: "I do not have that information in my knowledge base." Do NOT make up an answer. Do NOT answer as a generic AI.
    3. If the answer comprises multiple items, use a **bulleted list**.
    4. Keep the answer professional and concise, but ensure all relevant details from the context are included.

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
    ).with_config(tags=["inner_rag"])

    return _rag_chain
