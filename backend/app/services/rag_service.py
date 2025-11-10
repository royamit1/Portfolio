import glob
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, PyPDFLoader, WebBaseLoader
from app.core.config import settings

# --- 1. Load Documents from Multiple Sources ---

all_documents = []

# --- Source 1: Local Files (The "Local Cache" Approach) ---
# Load all .txt and .md files from the data directory.
# This is fast, reliable, and cost-effective.
local_file_paths = glob.glob("app/data/*.txt") + glob.glob("app/data/*.md")
for path in local_file_paths:
    loader = TextLoader(path)  # TextLoader works perfectly for .md files too
    all_documents.extend(loader.load())

# --- Source 2: Web URLs (Use sparingly for dynamic content) ---
# Define any URLs that MUST be fetched live. Keep this list short.
urls_to_load = [
    "https://github.com/royamit1",
    "https://dev.to/roy_amit/space-ease-rent-your-space-park-with-ease-21bg"
]

if urls_to_load:
    url_loader = WebBaseLoader(urls_to_load)
    try:
        all_documents.extend(url_loader.load())
    except Exception as e:
        print(f"Warning: Error loading URLs: {e}")

# --- Source 3: PDF Files ---
pdf_document_paths = glob.glob("app/data/*.pdf")
for path in pdf_document_paths:
    loader = PyPDFLoader(path)
    all_documents.extend(loader.load())

# --- 2. Split the Combined Documents ---
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
documents = text_splitter.split_documents(all_documents)

# --- 3. Create Embeddings and Vector Store ---
embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())
vector_store = FAISS.from_documents(documents, embeddings)

# --- 4. Create the Retriever ---
retriever = vector_store.as_retriever()


def get_retriever():
    """Returns the retriever instance."""
    return retriever
