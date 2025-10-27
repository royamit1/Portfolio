# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from app.handlers.multi_source import handle_multi_source_question
# from pydantic import BaseModel
#
#
# class AskRequest(BaseModel):
#     question: str
#
#
# app = FastAPI(title="Portfolio MCP Server")
#
# # Allow your frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Change this to your frontend domain later
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
#
# @app.get("/")
# def root():
#     return {"message": "Portfolio MCP Server running 🚀"}
#
#
# @app.post("/ask")
# async def ask_question(body: AskRequest):
#     question = body.question
#     answer = await handle_multi_source_question(question)
#     return {"answer": answer}
#
#
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.product_routes import router
from dotenv import load_dotenv
from app.core.logging import setup_logging
from app.core.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables
    Base.metadata.create_all(bind=engine)
    yield


load_dotenv()

setup_logging()
app: FastAPI = FastAPI(
    title="FastAPI Portfolio RAG ChatBot API",
    lifespan=lifespan
)
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root route
@app.get("/")
async def root():
    return {"message": "Portfolio API is running!"}
