from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from app.core.config import settings

loader = TextLoader("app/data/portfolio_data.txt")
_documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
documents = text_splitter.split_documents(_documents)

embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY.get_secret_value())

vector_store = FAISS.from_documents(documents, embeddings)

retriever = vector_store.as_retriever()


def get_retriever():
    """Returns the retriever instance."""
    return retriever
