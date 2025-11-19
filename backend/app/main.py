from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from app.core.logging import setup_logging
from app.routers import chat, contact
from app.core.limiter import limiter
from slowapi.errors import RateLimitExceeded
import logging

logger = logging.getLogger(__name__)

# --- Application Setup ---
load_dotenv()
setup_logging()

app: FastAPI = FastAPI(title="FastAPI Portfolio RAG ChatBot API")

# Attach the limiter to the app's state and add the exception handler
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """
    Custom handler for rate limit exceeded exceptions.
    Logs the incident and returns a user-friendly response.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.warning(
        f"Rate limit exceeded for IP {client_ip} on path {request.url.path}"
    )

    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "detail": "You've made too many requests. Please wait a moment and try again.",
            "path": str(request.url.path),
        },
        headers={
            "Retry-After": "60"  # Suggests client wait 60 seconds
        }
    )

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
