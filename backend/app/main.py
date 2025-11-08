from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.core.logging import setup_logging
from app.routers import chat, contact

load_dotenv()

setup_logging()
app: FastAPI = FastAPI(title="FastAPI Portfolio RAG ChatBot API")

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

app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])


@app.get("/")
async def root():
    return {"message": "Portfolio API is running!"}
