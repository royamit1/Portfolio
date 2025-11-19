import os
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from app.core.config import settings

# --- 1. Define Paths and Constants ---
FAISS_INDEX_PATH = "faiss_index"
DATA_DIR_PATH = "app/data/"

# Global variable to hold the retriever instance (Singleton pattern)
_retriever = None


def _initialize_vector_store():
    """
    Internal function to load or build the FAISS index.
    This is now called on-demand or via startup event, not at import time.
    """
    embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

    if os.path.exists(FAISS_INDEX_PATH):
        print("INFO:     Loading existing FAISS index from disk.")
        # Note: allow_dangerous_deserialization is necessary for local files we trust,
        # but be careful if this file comes from untrusted sources.
        vector_store = FAISS.load_local(
            FAISS_INDEX_PATH,
            embeddings,
            allow_dangerous_deserialization=True
        )
    else:
        print("INFO:     No FAISS index found. Building new one from scratch.")
        print(f"INFO:     Loading documents from {DATA_DIR_PATH}...")

        text_loader_kwargs = {'autodetect_encoding': True}
        text_loader = DirectoryLoader(
            DATA_DIR_PATH, glob="**/*.txt", loader_cls=TextLoader,
            loader_kwargs=text_loader_kwargs, show_progress=True, use_multithreading=True
        )
        pdf_loader = DirectoryLoader(
            DATA_DIR_PATH, glob="**/*.pdf", loader_cls=PyPDFLoader, show_progress=True
        )

        # Check if data directory exists to avoid crash
        if not os.path.exists(DATA_DIR_PATH):
            os.makedirs(DATA_DIR_PATH)
            print(f"WARNING:  Created empty data directory at {DATA_DIR_PATH}")
            all_documents = []
        else:
            all_documents = text_loader.load() + pdf_loader.load()

        if not all_documents:
            print("WARNING:  No documents found. Creating empty index.")
            # Create a dummy document to initialize FAISS if empty
            from langchain.docstore.document import Document
            documents = [Document(page_content="Portfolio is currently empty.", metadata={"source": "system"})]
        else:
            print(f"INFO:     Loaded {len(all_documents)} documents in total.")
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            documents = text_splitter.split_documents(all_documents)
            print(f"INFO:     Split into {len(documents)} document chunks.")

        vector_store = FAISS.from_documents(documents, embeddings)
        vector_store.save_local(FAISS_INDEX_PATH)
        print(f"INFO:     New FAISS index built and saved to {FAISS_INDEX_PATH}.")

    return vector_store.as_retriever(search_kwargs={"k": 3})


def get_retriever():
    """
    Returns the retriever instance, initializing it if necessary.
    """
    global _retriever
    if _retriever is None:
        _retriever = _initialize_vector_store()
    return _retriever
