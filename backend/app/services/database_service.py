from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any, Optional
from app.database.database import SessionLocal
from app.models.models import Profile, Skill, Experience, Project, ChatHistory
from app.core.logging import get_logger

logger = get_logger(__name__)


class DatabaseService:
    """Service for database operations"""

    def __init__(self):
        pass

    def get_session(self) -> Session:
        """Get database session"""
        return SessionLocal()

    async def test_connection(self) -> bool:
        """Test database connection"""
        try:
            with self.get_session() as db:
                db.execute(text("SELECT 1"))
                return True
        except Exception as e:
            logger.error(f"Database connection test failed: {e}")
            return False

    # Profile operations
    def get_profile(self) -> Optional[Dict[str, Any]]:
        """Get user profile"""
        try:
            with self.get_session() as db:
                profile = db.query(Profile).first()
                if profile:
                    return {
                        "id": profile.id,
                        "name": profile.name,
                        "title": profile.title,
                        "email": profile.email,
                        "phone": profile.phone,
                        "location": profile.location,
                        "linkedin": profile.linkedin,
                        "github": profile.github,
                        "website": profile.website,
                        "bio": profile.bio,
                        "resume_url": profile.resume_url
                    }
                return None
        except Exception as e:
            logger.error(f"Failed to get profile: {e}")
            return None

    def create_or_update_profile(self, profile_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create or update user profile"""
        try:
            with self.get_session() as db:
                # Check if profile exists
                profile = db.query(Profile).first()

                if profile:
                    # Update existing profile
                    for key, value in profile_data.items():
                        if hasattr(profile, key):
                            setattr(profile, key, value)
                else:
                    # Create new profile
                    profile = Profile(**profile_data)
                    db.add(profile)

                db.commit()
                db.refresh(profile)

                return {
                    "id": profile.id,
                    "name": profile.name,
                    "title": profile.title,
                    "email": profile.email
                }
        except Exception as e:
            logger.error(f"Failed to create/update profile: {e}")
            return None

    # Skills operations
    def get_skills(self, featured_only: bool = False) -> List[Dict[str, Any]]:
        """Get all skills or featured skills only"""
        try:
            with self.get_session() as db:
                query = db.query(Skill)
                if featured_only:
                    query = query.filter(Skill.is_featured == True)

                skills = query.all()
                return [
                    {
                        "id": skill.id,
                        "name": skill.name,
                        "category": skill.category,
                        "proficiency": skill.proficiency,
                        "years_experience": skill.years_experience,
                        "description": skill.description,
                        "is_featured": skill.is_featured
                    }
                    for skill in skills
                ]
        except Exception as e:
            logger.error(f"Failed to get skills: {e}")
            return []

    def create_skill(self, skill_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new skill"""
        try:
            with self.get_session() as db:
                skill = Skill(**skill_data)
                db.add(skill)
                db.commit()
                db.refresh(skill)

                return {
                    "id": skill.id,
                    "name": skill.name,
                    "category": skill.category,
                    "proficiency": skill.proficiency
                }
        except Exception as e:
            logger.error(f"Failed to create skill: {e}")
            return None

    # Experience operations
    def get_experiences(self, experience_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get experiences, optionally filtered by type"""
        try:
            with self.get_session() as db:
                query = db.query(Experience)
                if experience_type:
                    query = query.filter(Experience.type == experience_type)

                experiences = query.order_by(Experience.start_date.desc()).all()
                return [
                    {
                        "id": exp.id,
                        "type": exp.type,
                        "title": exp.title,
                        "company": exp.company,
                        "location": exp.location,
                        "start_date": exp.start_date.isoformat() if exp.start_date else None,
                        "end_date": exp.end_date.isoformat() if exp.end_date else None,
                        "is_current": exp.is_current,
                        "description": exp.description,
                        "achievements": exp.achievements,
                        "technologies": exp.technologies
                    }
                    for exp in experiences
                ]
        except Exception as e:
            logger.error(f"Failed to get experiences: {e}")
            return []

    # Project operations (for database storage, separate from GitHub API)
    def get_stored_projects(self) -> List[Dict[str, Any]]:
        """Get projects stored in database"""
        try:
            with self.get_session() as db:
                projects = db.query(Project).filter(Project.is_featured == True).all()
                return [
                    {
                        "id": proj.id,
                        "name": proj.name,
                        "title": proj.title,
                        "description": proj.description,
                        "detailed_description": proj.detailed_description,
                        "tech_stack": proj.tech_stack,
                        "github_url": proj.github_url,
                        "demo_url": proj.demo_url,
                        "language": proj.language,
                        "stars": proj.stars,
                        "forks": proj.forks
                    }
                    for proj in projects
                ]
        except Exception as e:
            logger.error(f"Failed to get stored projects: {e}")
            return []

    # Chat history operations
    def save_chat_message(self, session_id: str, user_message: str, ai_response: str,
                          response_time_ms: int, context_used: Dict[str, Any]) -> bool:
        """Save chat interaction to database"""
        try:
            with self.get_session() as db:
                chat_entry = ChatHistory(
                    session_id=session_id,
                    user_message=user_message,
                    ai_response=ai_response,
                    response_time_ms=response_time_ms,
                    context_used=context_used
                )
                db.add(chat_entry)
                db.commit()
                return True
        except Exception as e:
            logger.error(f"Failed to save chat message: {e}")
            return False

    def get_chat_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get chat history for a session"""
        try:
            with self.get_session() as db:
                chats = (db.query(ChatHistory)
                         .filter(ChatHistory.session_id == session_id)
                         .order_by(ChatHistory.created_at.desc())
                         .limit(limit)
                         .all())

                return [
                    {
                        "user_message": chat.user_message,
                        "ai_response": chat.ai_response,
                        "created_at": chat.created_at.isoformat(),
                        "response_time_ms": chat.response_time_ms
                    }
                    for chat in reversed(chats)  # Reverse to get chronological order
                ]
        except Exception as e:
            logger.error(f"Failed to get chat history: {e}")
            return []
