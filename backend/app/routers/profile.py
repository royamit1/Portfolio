from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.core.factory import get_database_service
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()


@router.get("/profile")
async def get_profile() -> Dict[str, Any]:
    """Get user profile information"""
    try:
        db_svc = get_database_service()
        profile = db_svc.get_profile()

        if not profile:
            # Return default profile data if none exists in database
            profile_data = {
                "name": "Roy Amit",
                "title": "Full Stack Developer",
                "email": "roy@example.com",
                "github": f"https://github.com/{settings.github_username}",
                "bio": "Passionate developer learning modern backend technologies including FastAPI, Docker, PostgreSQL, and Redis",
                "location": "Israel",
                "skills_count": len(db_svc.get_skills()),
                "experience_count": len(db_svc.get_experiences())
            }
        else:
            profile_data = profile
            profile_data["skills_count"] = len(db_svc.get_skills())
            profile_data["experience_count"] = len(db_svc.get_experiences())

        logger.info("Successfully retrieved profile data")
        return profile_data

    except Exception as e:
        logger.error(f"Failed to get profile: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch profile: {str(e)}"
        )


@router.get("/skills")
async def get_skills(featured_only: bool = False) -> List[Dict[str, Any]]:
    """Get all skills or featured skills only"""
    try:
        db_svc = get_database_service()
        skills = db_svc.get_skills(featured_only=featured_only)

        logger.info(f"Successfully retrieved {len(skills)} skills")
        return skills

    except Exception as e:
        logger.error(f"Failed to get skills: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch skills: {str(e)}"
        )


@router.get("/experiences")
async def get_experiences(experience_type: str = None) -> List[Dict[str, Any]]:
    """Get experiences, optionally filtered by type (work, education, project)"""
    try:
        db_svc = get_database_service()
        experiences = db_svc.get_experiences(experience_type=experience_type)

        logger.info(f"Successfully retrieved {len(experiences)} experiences")
        return experiences

    except Exception as e:
        logger.error(f"Failed to get experiences: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch experiences: {str(e)}"
        )
