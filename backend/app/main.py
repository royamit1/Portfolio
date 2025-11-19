from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from app.core.logging import setup_logging
from app.routers import chat, contact
from app.core.limiter import limiter
from slowapi.errors import RateLimitExceeded
from app.core.exceptions import custom_rate_limit_handler
from app.services.rag_service import ingest_data

# --- Application Setup ---
load_dotenv()
setup_logging()


# --- Lifespan Event for Startup ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager:
    1. Connects to Postgres.
    2. Checks if Vector DB needs data.
    3. Ingests data if empty.
    """
    print("INFO:     Application startup: Running data ingestion...")
    try:
        # [OPTIMIZATION] Now calling the async wrapper with await
        # This keeps the event loop responsive during heavy PDF processing
        await ingest_data()
        print("INFO:     Application startup: Data ingestion complete.")
    except Exception as e:
        print(f"ERROR:    Critical error during data ingestion: {e}")
        # We don't raise here so the app can still start (e.g. for health checks),
        # but the RAG features might fail.

    yield

    print("INFO:     Application shutdown.")


app: FastAPI = FastAPI(
    title="FastAPI Portfolio RAG ChatBot API",
    lifespan=lifespan
)

# Attach the limiter and exception handler
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
