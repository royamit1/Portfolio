from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest
from app.services.agent_service import stream_agent_response
from app.core.limiter import limiter

router = APIRouter()

MAX_INPUT_LENGTH = 400


@router.post("/chat")
@limiter.limit("10/day")
async def chat(chat_request: ChatRequest, request: Request):
    """
    Receives a chat message, validates its length, and returns a streaming response.
    """
    if len(chat_request.message) > MAX_INPUT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Input message is too long. Please limit your message to {MAX_INPUT_LENGTH} characters."
        )

    # [CRITICAL FIX]: media_type MUST be "text/event-stream" for SSE to work.
    # We also call the service directly for conciseness.
    return StreamingResponse(
        stream_agent_response(chat_request.message, chat_request.session_id),
        media_type="text/event-stream"
    )
