import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever
from langchain.docstore.document import Document
from app.core.config import settings

# --- Constants ---
DATA_DIR_PATH = "app/data/"
COLLECTION_NAME = "portfolio_documents"

_retriever = None
_engine = None


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
    Hybrid Search Initialization (BM25 + PGVector).
    Strategy: Always re-index on startup to ensure 'Live' data matches 'Git' data.
    """
    global _retriever
    if _retriever is not None:
        return

    print("INFO:     Initializing Hybrid Search retriever...")

    # 1. Load Documents (Always needed for BM25 memory index)
    documents = await asyncio.to_thread(_load_and_split_files_sync)
    if not documents:
        # Fallback to prevent crash if folder is empty
        documents = [Document(page_content="Portfolio is currently empty.", metadata={"source": "system"})]

    # 2. Setup Vector Store (Semantic Search)
    engine = await get_db_engine()
    embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

    vector_store = PGVector(
        embeddings=embeddings,
        collection_name=COLLECTION_NAME,
        connection=engine,
        use_jsonb=True,
    )

    # 3. Smart Sync Strategy:
    # Instead of "skip if exists", we try to ensure freshness.
    # For a simple portfolio, we can just ADD documents.
    # (In a real production app, you would check hashes to avoid duplicates,
    # but for this scale, adding ensures new info is present.
    # Ideally, you'd drop the table on startup, but that's risky for uptime).

    # Check if DB is empty to avoid massive duplication on every restart
    try:
        existing = await vector_store.asimilarity_search("test", k=1)
        is_empty = len(existing) == 0
    except Exception:
        is_empty = True

    if is_empty:
        print("INFO:     Vector DB empty. Hydrating from files...")
        await vector_store.aadd_documents(documents)
        print("INFO:     Vector DB hydration complete.")

    else:
        # [OPTIONAL] If you want to force updates, you could uncomment the line below,
        # but be aware it duplicates data unless you implement cleanup logic.
        # await vector_store.aadd_documents(documents)
        print("INFO:     Vector DB already contains data. Skipping semantic re-ingestion.")

    # 4. Initialize Retrievers

    # A. Keyword Retriever (BM25) - Runs in Memory
    # Excellent for specific tech names ("Zustand", "Drizzle", "C#")
    bm25_retriever = BM25Retriever.from_documents(documents)
    bm25_retriever.k = 10  # [FIX] Keep this high for keyword coverage

    # B. Semantic Retriever (Vector) - Runs on Neon
    # Excellent for concepts ("Backend experience", "Challenges faced")
    # [FIX] k=10 ensures we get enough context. Total context = 20 chunks.
    vector_retriever = vector_store.as_retriever(search_kwargs={"k": 10})

    # C. Ensemble (The Hybrid Brain)
    # Weights: 0.4 (Keyword) / 0.6 (Semantic).
    # We bias slightly towards meaning, but keywords still boost rank significantly.
    _retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever],
        weights=[0.4, 0.6]
    )

    print("INFO:     Hybrid Search (Ensemble) retriever is ready.")


async def get_db_engine():
    """Ensures a singleton DB engine to prevent connection leaks."""
    global _engine
    if _engine is None:
        _engine = create_async_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,  # Checks if connection is alive before using it
            pool_recycle=300,    # Recycles connections every 5 minutes to prevent timeouts
        )
    return _engine


def get_retriever():
    """
    Synchronous access to the global retriever.
    """
    global _retriever
    if _retriever is None:
        raise RuntimeError("Retriever not initialized. Did 'ingest_data' run?")
    return _retriever
