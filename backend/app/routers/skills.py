from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Skill

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("/")
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()
