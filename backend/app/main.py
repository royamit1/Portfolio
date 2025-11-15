from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.core.logging import setup_logging
from app.routers import chat, contact
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# --- Rate Limiting Setup ---
# The limiter will use the client's IP address as the key.
limiter = Limiter(key_func=get_remote_address, default_limits=["15/minute"])

# --- Application Setup ---
load_dotenv()
setup_logging()

app: FastAPI = FastAPI(title="FastAPI Portfolio RAG ChatBot API")

# Add the rate limiter to the application's state and exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
# The rate limit will be applied directly in the router files using decorators.
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])


# --- Root Route ---
@app.get("/")
async def root():
    return {"message": "Portfolio API is running!"}
