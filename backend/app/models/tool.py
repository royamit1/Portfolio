from pydantic import BaseModel, Field


class KnowledgeBaseToolInput(BaseModel):
    """Input schema for the PortfolioKnowledgeBase tool."""
    question: str = Field(description="The user's question about Roy Amit's portfolio, skills, or experience.")


class ResumeEmailToolInput(BaseModel):
    """Input schema for the SendResumeEmail tool."""
    recipient: str = Field(description="The email address to send the resume to.")
