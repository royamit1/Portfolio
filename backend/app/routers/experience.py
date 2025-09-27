from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Experience

router = APIRouter(prefix="/experience", tags=["Experience"])


@router.get("/")
def get_experience(db: Session = Depends(get_db)):
    return db.query(Experience).all()
