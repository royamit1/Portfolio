from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest
from app.services.chatbot_service import stream_chatbot_response

router = APIRouter()


async def stream_generator(message: str, session_id: str):
    """Yields response chunks from the chatbot service."""
    async for chunk in stream_chatbot_response(message, session_id):
        yield chunk


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Receives a chat message and returns a streaming response of the chatbot's reply.
    """
    return StreamingResponse(stream_generator(request.message, request.session_id), media_type="text/plain")
