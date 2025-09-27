from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from app.database.database import Base


# ------------------------
# Profile (your personal info)
# ------------------------
class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    location = Column(String(100), nullable=True)
    linkedin = Column(String(200), nullable=True)
    github = Column(String(200), nullable=True)
    website = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    resume_url = Column(String(300), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# ------------------------
# Project (portfolio projects)
# ------------------------
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    title = Column(String(200), nullable=True)  # Display title
    description = Column(Text, nullable=True)
    detailed_description = Column(Text, nullable=True)  # For AI context
    tech_stack = Column(JSON, nullable=True)  # List of technologies
    github_url = Column(String(300), nullable=True)
    demo_url = Column(String(300), nullable=True)
    image_url = Column(String(300), nullable=True)
    is_featured = Column(Boolean, default=False)
    is_contribution = Column(Boolean, default=False)
    stars = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# ------------------------
# Skill (technical skills)
# ------------------------
class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=True)  # e.g., "Backend", "Frontend"
    proficiency = Column(Integer, nullable=True)  # 1-10 scale
    years_experience = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ------------------------
# Experience (work/education)
# ------------------------
class Experience(Base):
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20), nullable=False)  # "work", "education", "project"
    title = Column(String(200), nullable=False)
    company = Column(String(200), nullable=True)
    location = Column(String(100), nullable=True)
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    achievements = Column(JSON, nullable=True)  # List of key achievements
    technologies = Column(JSON, nullable=True)  # Technologies used
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ------------------------
# ChatHistory (store AI conversations)
# ------------------------
class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), nullable=True, index=True)
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    response_time_ms = Column(Integer, nullable=True)
    context_used = Column(JSON, nullable=True)  # What data was used to generate response
    feedback_rating = Column(Integer, nullable=True)  # 1-5 stars if user rates
    created_at = Column(DateTime(timezone=True), server_default=func.now())
