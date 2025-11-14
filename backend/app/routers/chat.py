from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest
from app.services.agent_service import stream_agent_response # <-- CHANGED

router = APIRouter()

async def stream_generator(message: str, session_id: str):
    """Yields response chunks from the agent service."""
    async for chunk in stream_agent_response(message, session_id): # <-- CHANGED
        yield chunk

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Receives a chat message and returns a streaming response from the AI agent.
    """
    return StreamingResponse(stream_generator(request.message, request.session_id), media_type="text/plain")
