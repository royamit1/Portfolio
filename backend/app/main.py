from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.core.logging import setup_logging
from app.routers import chat, contact
from app.core.limiter import limiter
from slowapi.errors import RateLimitExceeded
from app.core.exceptions import custom_rate_limit_handler
from app.services.rag_service import get_retriever

# --- Application Setup ---
load_dotenv()
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for the FastAPI app.
    Handles startup and shutdown events.
    """
    # --- STARTUP ---
    print("INFO:     Initializing RAG Retriever (Vector DB)...")
    # This triggers the vector store build/load immediately on startup
    get_retriever()
    print("INFO:     RAG Retriever initialized successfully.")

    yield

    # --- SHUTDOWN ---
    print("INFO:     Shutting down Portfolio API...")


# Initialize FastAPI with the lifespan handler
app: FastAPI = FastAPI(
    title="FastAPI Portfolio RAG ChatBot API",
    lifespan=lifespan
)

# Attach the limiter to the app's state and add the custom exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_handler)

# --- Middleware Configuration ---
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])


# --- Root Route ---
@app.get("/")
async def root():
    return {"message": "Portfolio API is running!"}
