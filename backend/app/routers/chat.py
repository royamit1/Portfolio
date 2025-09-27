from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.ai_service import get_ai_response

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
async def chat(message: str, db: Session = Depends(get_db)):
    response = await get_ai_response(message, db)
    return {"response": response}
