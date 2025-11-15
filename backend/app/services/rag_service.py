import os
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from app.core.config import settings

# --- 1. Define Paths and Constants ---
FAISS_INDEX_PATH = "faiss_index"
DATA_DIR_PATH = "app/data/"

# --- 2. Initialize Embeddings ---
embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

# --- 3. The Core "Load or Build" Logic ---
if os.path.exists(FAISS_INDEX_PATH):
    print("INFO:     Loading existing FAISS index from disk.")
    vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
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

    all_documents = text_loader.load() + pdf_loader.load()
    print(f"INFO:     Loaded {len(all_documents)} documents in total.")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    documents = text_splitter.split_documents(all_documents)
    print(f"INFO:     Split into {len(documents)} document chunks.")

    vector_store = FAISS.from_documents(documents, embeddings)
    vector_store.save_local(FAISS_INDEX_PATH)
    print(f"INFO:     New FAISS index built and saved to {FAISS_INDEX_PATH}.")

# --- 4. Create the Retriever ---
# --- UPDATED: Limit the number of retrieved documents to 3 ---
retriever = vector_store.as_retriever(search_kwargs={"k": 3})


def get_retriever():
    """Returns the retriever instance."""
    return retriever
