import os
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from app.core.config import settings

# --- 1. Define Paths and Constants ---
FAISS_INDEX_PATH = "faiss_index"
DATA_PATH = "app/data/portfolio_data.txt"

# --- 2. Initialize Embeddings ---
# This can be created once and reused.
embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

# --- 3. The Core "Load or Build" Logic ---
if os.path.exists(FAISS_INDEX_PATH):
    # If the index already exists, load it directly.
    # This is fast and avoids unnecessary API calls.
    print("INFO:     Loading existing FAISS index from disk.")
    vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
else:
    # If the index does not exist, build it for the first time.
    # This is a one-time, expensive operation.
    print("INFO:     No FAISS index found. Building new one from scratch.")

    # Load the document
    loader = TextLoader(DATA_PATH)
    _documents = loader.load()

    # Split the document into smaller chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    documents = text_splitter.split_documents(_documents)

    # Create the vector store from the documents
    vector_store = FAISS.from_documents(documents, embeddings)

    # Save the newly created index to disk for future use
    vector_store.save_local(FAISS_INDEX_PATH)
    print(f"INFO:     New FAISS index built and saved to {FAISS_INDEX_PATH}.")

# --- 4. Create the Retriever ---
# The retriever is created from the loaded or newly built vector store.
retriever = vector_store.as_retriever()


def get_retriever():
    """Returns the retriever instance."""
    return retriever
