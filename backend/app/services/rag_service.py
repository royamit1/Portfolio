import os
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader  # <-- CHANGED
from app.core.config import settings

# --- 1. Define Paths and Constants ---
FAISS_INDEX_PATH = "faiss_index"
DATA_DIR_PATH = "app/data/"  # <-- CHANGED to directory

# --- 2. Initialize Embeddings ---
embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

# --- 3. The Core "Load or Build" Logic ---
if os.path.exists(FAISS_INDEX_PATH):
    # Load the existing index from disk
    print("INFO:     Loading existing FAISS index from disk.")
    vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
else:
    # Build the index for the first time
    print("INFO:     No FAISS index found. Building new one from scratch.")

    # --- UPDATED DYNAMIC LOADING ---
    # Use DirectoryLoader to load all .txt and .md files from the data directory.
    # The glob pattern '**/*' ensures it looks in subdirectories as well.
    loader = DirectoryLoader(
        DATA_DIR_PATH,
        glob="**/*",  # Search all subdirectories
        loader_cls=TextLoader,  # Use TextLoader for each file found
        show_progress=True,
        use_multithreading=True
    )

    print(f"INFO:     Loading documents from {DATA_DIR_PATH}...")
    _documents = loader.load()
    # -----------------------------

    # Split the documents into smaller chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    documents = text_splitter.split_documents(_documents)
    print(f"INFO:     Loaded and split {len(documents)} document chunks.")

    # Create the vector store from the documents
    vector_store = FAISS.from_documents(documents, embeddings)

    # Save the newly created index to disk
    vector_store.save_local(FAISS_INDEX_PATH)
    print(f"INFO:     New FAISS index built and saved to {FAISS_INDEX_PATH}.")

# --- 4. Create the Retriever ---
retriever = vector_store.as_retriever()


def get_retriever():
    """Returns the retriever instance."""
    return retriever
