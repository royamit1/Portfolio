from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest
from app.services.agent_service import stream_agent_response
from app.main import limiter  # <-- NEW IMPORT

router = APIRouter()

# Define a reasonable character limit for user input
MAX_INPUT_LENGTH = 2000


async def stream_generator(message: str, session_id: str):
    """Yields response chunks from the agent service."""
    async for chunk in stream_agent_response(message, session_id):
        yield chunk


@router.post("/chat")
@limiter.limit("10/minute")  # <-- RATE LIMIT APPLIED
async def chat(request: ChatRequest):
    """
    Receives a chat message, validates its length, and returns a streaming response.
    """
    if len(request.message) > MAX_INPUT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Input message is too long. Please limit your message to {MAX_INPUT_LENGTH} characters."
        )

    return StreamingResponse(
        stream_generator(request.message, request.session_id),
        media_type="text/plain"
    )
