import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.limiter import limiter
from app.core.exceptions import custom_rate_limit_handler
from app.services.rag_service import ingest_data
from app.routers import chat, contact

setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown events for RAG knowledge base ingestion."""
    logger.info("Application startup: Beginning data ingestion...")
    try:
        await ingest_data()
        logger.info("Application startup: Data ingestion complete.")
    except Exception as e:
        # We log the error but don't crash the app, so the health check still passes
        logger.error(f"Critical error during data ingestion: {e}", exc_info=True)

    yield

    logger.info("Application shutdown.")


app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# SSE (Server-Sent Events) Stability Middleware
@app.middleware("http")
async def add_sse_headers(request: Request, call_next):
    """Ensures correct headers for SSE to prevent proxy buffering."""
    response = await call_next(request)
    if response.media_type == "text/event-stream":
        response.headers["Cache-Control"] = "no-cache, no-transform"
        response.headers["Connection"] = "keep-alive"
        response.headers["X-Accel-Buffering"] = "no"
    return response


# Routers
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])


# --- System Endpoints ---

@app.get("/health", include_in_schema=False)
@app.head("/health", include_in_schema=False)
async def health_check():
    """Endpoint for load balancers and uptime monitors."""
    return {"status": "healthy", "environment": settings.ENVIRONMENT}


@app.get("/")
async def root():
    return {
        "message": f"{settings.APP_NAME} is running",
        "docs": "/docs"
    }
