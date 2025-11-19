import os
import asyncio
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from app.core.config import settings

# --- 1. Define Paths and Constants ---
DATA_DIR_PATH = "app/data/"
COLLECTION_NAME = "portfolio_documents"

# Global variable for the retriever (Singleton)
_retriever = None


def _ingest_data_sync():
    """
    Internal synchronous function that performs the heavy I/O and DB operations.
    This is defined as sync so it can be called as a fallback if needed.
    """
    global _retriever

    # If already initialized, skip
    if _retriever is not None:
        print("INFO:     RAG Retriever already initialized.")
        return

    print("INFO:     Initializing connection to PostgreSQL Vector DB...")

    embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

    # Initialize the PGVector store
    vector_store = PGVector(
        embeddings=embeddings,
        collection_name=COLLECTION_NAME,
        connection=settings.DATABASE_URL,
        use_jsonb=True,
    )

    # --- Idempotency Check ---
    is_empty = False
    try:
        # Try to find just 1 document to see if data exists
        test_results = vector_store.similarity_search("test", k=1)
        is_empty = len(test_results) == 0
    except Exception:
        is_empty = True

    if is_empty:
        print("INFO:     Vector DB collection appears empty. Starting ingestion...")

        if not os.path.exists(DATA_DIR_PATH):
            os.makedirs(DATA_DIR_PATH)
            print(f"WARNING:  Created empty data directory at {DATA_DIR_PATH}")

        print(f"INFO:     Loading documents from {DATA_DIR_PATH}...")

        # Load Text Files
        text_loader = DirectoryLoader(
            DATA_DIR_PATH, glob="**/*.txt", loader_cls=TextLoader,
            loader_kwargs={'autodetect_encoding': True}, show_progress=True, use_multithreading=True
        )
        # Load PDF Files
        pdf_loader = DirectoryLoader(
            DATA_DIR_PATH, glob="**/*.pdf", loader_cls=PyPDFLoader, show_progress=True
        )

        # Load them (Blocking I/O)
        all_documents = text_loader.load() + pdf_loader.load()

        if not all_documents:
            print("WARNING:  No documents found in app/data/. Creating a placeholder.")
            from langchain.docstore.document import Document
            documents = [Document(page_content="Portfolio is currently empty.", metadata={"source": "system"})]
        else:
            print(f"INFO:     Loaded {len(all_documents)} documents.")
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            documents = text_splitter.split_documents(all_documents)
            print(f"INFO:     Split into {len(documents)} chunks.")

        # Add to DB
        vector_store.add_documents(documents)
        print("INFO:     Documents successfully ingested into PostgreSQL.")
    else:
        print("INFO:     Vector DB already contains data. Skipping ingestion.")

    # Set the global retriever
    _retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    print("INFO:     RAG Retriever ready.")


async def ingest_data():
    """
    Async wrapper that runs the synchronous ingestion logic in a separate thread.
    This ensures the main asyncio event loop remains non-blocking during startup.
    """
    print("INFO:     Offloading data ingestion to thread pool...")
    # asyncio.to_thread runs the sync function in a separate thread and awaits it
    await asyncio.to_thread(_ingest_data_sync)


def get_retriever():
    """
    Returns the retriever instance.
    """
    global _retriever
    if _retriever is None:
        print("WARNING:  get_retriever called before ingest_data. Triggering lazy ingestion (Sync Fallback).")
        # Fallback to sync ingestion directly (SAFE),
        # whereas asyncio.run() would crash the server loop.
        _ingest_data_sync()
    return _retriever
