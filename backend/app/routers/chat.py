from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from app.schemas import ChatRequest
from app.services.agent_service import stream_agent_response
from app.core.limiter import limiter, ip_limiter

router = APIRouter()

MAX_INPUT_LENGTH = 500


@router.post("/chat")
@limiter.limit("30/day; 25/2 hours; 7/minute")       # Per-session: normal UX limits
@ip_limiter.limit("30/day; 25/2 hours; 7/minute")        # Per-IP: hard ceiling, can't bypass by rotating sessions
async def chat(chat_request: ChatRequest, request: Request):
    """
    Streaming chat endpoint using Server-Sent Events (SSE).
    Dual rate limiting: session-based + IP-based anti-abuse.
    """
    if len(chat_request.message) > MAX_INPUT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Message too long. Limit is {MAX_INPUT_LENGTH} characters."
        )

    # Return the generator directly as a StreamingResponse
    return StreamingResponse(
        stream_agent_response(chat_request.message, chat_request.session_id),
        media_type="text/event-stream"
    )
