import os
import asyncio
import logging
from typing import List, Optional

from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever
from langchain.docstore.document import Document
from langchain_core.retrievers import BaseRetriever

from app.core.config import settings

logger = logging.getLogger(__name__)

# --- Configuration ---
DATA_DIR_PATH = "app/data/"
COLLECTION_NAME = settings.VECTOR_DB_COLLECTION
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# --- Singletons ---
_retriever: Optional[BaseRetriever] = None
_engine: Optional[AsyncEngine] = None


def _load_documents_from_disk() -> List[Document]:
    """
    Scans the data directory for TXT and PDF files, loads them, and splits them into chunks.
    This is a CPU-bound operation designed to run in a separate thread.
    """
    if not os.path.exists(DATA_DIR_PATH):
        os.makedirs(DATA_DIR_PATH)
        return []

    logger.info(f"Loading documents from {DATA_DIR_PATH}...")

    # Configure loaders
    # We use 'type: ignore' because LangChain's DirectoryLoader type hints
    # don't strictly match PyPDFLoader, even though it works at runtime.
    text_loader = DirectoryLoader(
        DATA_DIR_PATH,
        glob="**/*.txt",
        loader_cls=TextLoader,  # type: ignore
        loader_kwargs={'autodetect_encoding': True}
    )
    pdf_loader = DirectoryLoader(
        DATA_DIR_PATH,
        glob="**/*.pdf",
        loader_cls=PyPDFLoader  # type: ignore
    )

    raw_docs = text_loader.load() + pdf_loader.load()

    if not raw_docs:
        return []

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )

    split_docs = text_splitter.split_documents(raw_docs)
    logger.info(f"Processed {len(split_docs)} document chunks.")
    return split_docs


async def get_db_engine() -> AsyncEngine:
    """
    Returns a singleton database engine for the vector store.
    Configured with connection pooling to maintain stability.
    """
    global _engine
    if _engine is None:
        _engine = create_async_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300,
        )
    return _engine


async def ingest_data():
    """
    Main initialization sequence for the RAG system:
    1. Loads documents from disk (Threaded).
    2. Initializes the PGVector store (Semantic Search).
    3. Hydrates the database if empty.
    4. Initializes the BM25 retriever (Keyword Search).
    5. Combines them into an EnsembleRetriever (Hybrid Search).
    """
    global _retriever
    if _retriever is not None:
        return

    logger.info("Initializing Hybrid Search retriever...")

    # 1. Load Documents (Offload blocking I/O to thread)
    documents = await asyncio.to_thread(_load_documents_from_disk)

    if not documents:
        logger.warning("No documents found. Using placeholder content.")
        documents = [Document(page_content="Portfolio is currently empty.", metadata={"source": "system"})]

    # 2. Setup Vector Store
    engine = await get_db_engine()
    embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

    vector_store = PGVector(
        embeddings=embeddings,
        collection_name=COLLECTION_NAME,
        connection=engine,
        use_jsonb=True,
    )

    # 3. Smart Hydration (Only populate if empty)
    try:
        existing_docs = await vector_store.asimilarity_search("test", k=1)
        if not existing_docs:
            logger.info("Vector DB is empty. Hydrating...")
            await vector_store.aadd_documents(documents)
            logger.info("Vector DB hydration complete.")
        else:
            logger.info("Vector DB already contains data. Skipping semantic ingestion.")
    except Exception as e:
        logger.error(f"Error checking Vector DB state: {e}. Attempting to proceed.")

    # 4. Initialize Retrievers

    # A. Keyword Retriever (BM25)
    # Runs in-memory. Great for exact matches like specific tech names.
    bm25_retriever = BM25Retriever.from_documents(documents)
    bm25_retriever.k = 5

    # B. Semantic Retriever (PGVector)
    # Runs on DB. Great for conceptual queries.
    vector_retriever = vector_store.as_retriever(search_kwargs={"k": 5})

    # 5. Create Hybrid Ensemble
    # We prioritize meaning (0.6) over exact phrasing (0.4).
    _retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever],
        weights=[0.4, 0.6]
    )

    logger.info("Hybrid Search (Ensemble) retriever is ready.")


def get_retriever() -> BaseRetriever:
    """
    Synchronous accessor for the global retriever instance.
    """
    global _retriever
    if _retriever is None:
        raise RuntimeError("Retriever not initialized. Ensure 'ingest_data()' runs on startup.")
    return _retriever


def is_retriever_ready() -> bool:
    """Checks if the global retriever is initialized."""
    return _retriever is not None

