from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest
from app.services.agent_service import stream_agent_response
from app.core.limiter import limiter

router = APIRouter()

MAX_INPUT_LENGTH = 2000


async def stream_generator(message: str, session_id: str):
    """Yields response chunks from the agent service."""
    async for chunk in stream_agent_response(message, session_id):
        yield chunk


@router.post("/chat")
@limiter.limit("10/minute")
async def chat(request: Request):
    """
    Receives a chat message, validates its length, and returns a streaming response.
    The 'request' argument is required by the rate limiter.
    """
    try:
        body = await request.json()
        chat_request = ChatRequest(**body)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request body.")

    if len(chat_request.message) > MAX_INPUT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Input message is too long. Please limit your message to {MAX_INPUT_LENGTH} characters."
        )

    return StreamingResponse(
        stream_generator(chat_request.message, chat_request.session_id),
        media_type="text/plain"
    )
