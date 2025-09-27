from app.database.database import get_db
from sqlalchemy.orm import Session
from app.models.models import ChatHistory
from app.core.config import settings
import httpx


async def get_ai_response(user_message: str, db: Session):
    """
    Sends user message to AI API and returns response.
    Stores chat in database.
    """
    # 1. Prepare context about you
    context = "Roy is a software engineer. He has projects X, Y, Z."

    # 2. Call AI API (example using OpenAI GPT-3.5)
    response_text = await call_openai_api(user_message, context)

    # 3. Store in database
    chat_entry = ChatHistory(user_message=user_message, ai_response=response_text)
    db.add(chat_entry)
    db.commit()

    return response_text


async def call_openai_api(message: str, context: str):
    """
    This is a simplified example. Replace with real API call.
    """
    # Normally you'd use openai.ChatCompletion.create(...) here
    return f"AI response to '{message}' with context '{context}'"
