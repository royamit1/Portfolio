import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from langchain.docstore.document import Document
from app.core.config import settings

# --- Constants ---
DATA_DIR_PATH = "app/data/"
COLLECTION_NAME = "portfolio_documents"

# Global Retriever Singleton
_retriever = None


def _load_and_split_files_sync():
    """
    HEAVY CPU/IO TASK: Runs in a separate thread.
    Only reads files and splits them. Does NOT touch the DB.
    """
    if not os.path.exists(DATA_DIR_PATH):
        os.makedirs(DATA_DIR_PATH)
        return []

    print(f"INFO:     Loading documents from {DATA_DIR_PATH}...")

    text_loader = DirectoryLoader(
        DATA_DIR_PATH, glob="**/*.txt", loader_cls=TextLoader,
        loader_kwargs={'autodetect_encoding': True}
    )
    pdf_loader = DirectoryLoader(
        DATA_DIR_PATH, glob="**/*.pdf", loader_cls=PyPDFLoader
    )

    # Load all
    raw_docs = text_loader.load() + pdf_loader.load()

    if not raw_docs:
        return []

    # Split
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_docs = text_splitter.split_documents(raw_docs)
    print(f"INFO:     Processed {len(split_docs)} document chunks in thread.")
    return split_docs


async def ingest_data():
    """
    Main entry point for data ingestion.
    """
    global _retriever

    # 1. Initialize Async DB Engine (Must be on Main Loop)
    # We still use the engine here to ensure the connection is established on the correct loop for the heavy lifting
    engine = create_async_engine(settings.DATABASE_URL)
    embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

    vector_store = PGVector(
        embeddings=embeddings,
        collection_name=COLLECTION_NAME,
        connection=engine,
        use_jsonb=True,
    )

    # 2. Check if DB is empty (Async)
    try:
        existing = await vector_store.asimilarity_search("test", k=1)
        is_empty = len(existing) == 0
    except Exception:
        is_empty = True

    if is_empty:
        print("INFO:     DB empty. Starting file ingestion...")

        # 3. Run Heavy File IO in Thread
        documents = await asyncio.to_thread(_load_and_split_files_sync)

        if not documents:
            documents = [Document(page_content="Portfolio is currently empty.", metadata={"source": "system"})]

        # 4. Add to DB (Async)
        await vector_store.aadd_documents(documents)
        print("INFO:     Documents inserted into Vector DB.")
    else:
        print("INFO:     Vector DB already contains data. Skipping file load.")

    # 5. Initialize Retriever
    _retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    print("INFO:     Retriever is ready.")


def get_retriever():
    global _retriever
    if _retriever is None:
        # Fallback: If app started without running lifespan (e.g. tests)
        print("WARNING:  Retriever not initialized. Initializing lazily with connection string...")

        embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

        # [POLISH] Pass connection string directly.
        # PGVector handles the engine creation internally when a string is passed.
        vector_store = PGVector(
            embeddings=embeddings,
            collection_name=COLLECTION_NAME,
            connection=settings.DATABASE_URL,
            use_jsonb=True,
        )
        _retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    return _retriever
