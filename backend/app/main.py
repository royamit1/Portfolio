from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.core.logging import setup_logging
from app.routers import chat, contact
from app.core.limiter import limiter
from slowapi.errors import RateLimitExceeded
from app.core.exceptions import custom_rate_limit_handler # <-- We import our handler

# --- Application Setup ---
load_dotenv()
setup_logging()

app: FastAPI = FastAPI(title="FastAPI Portfolio RAG ChatBot API")

# Attach the limiter to the app's state and add the custom exception handler
app.state.limiter = limiter
# --- CORRECTED LINE ---
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
