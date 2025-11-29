from fastapi import FastAPI, Request
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
    print("INFO:     Application startup: Running data ingestion...")
    try:
        await ingest_data()
        print("INFO:     Application startup: Data ingestion complete.")
    except Exception as e:
        print(f"ERROR:    Critical error during data ingestion: {e}")
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


# --- Custom Middleware for SSE Stability ---
@app.middleware("http")
async def add_sse_headers(request: Request, call_next):
    """
    Middleware to ensure correct headers for Server-Sent Events (SSE)
    to prevent caching and proxy buffering issues.
    """
    response = await call_next(request)
    if response.media_type == "text/event-stream":
        response.headers["Cache-Control"] = "no-cache, no-transform"
        response.headers["Connection"] = "keep-alive"
        response.headers["X-Accel-Buffering"] = "no"
    return response


# --- Routers ---
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])


# --- Health Check Route ---
@app.get("/health", include_in_schema=False)
@app.head("/health", include_in_schema=False)
async def health_check():
    """
    Dedicated endpoint for Render/uptime monitors.
    Returns 200 OK to signal the service is alive.
    """
    return {"status": "healthy", "service": "Portfolio API"}


# --- Root Route ---
@app.get("/")
async def root():
    return {"message": "Portfolio API is running!"}
