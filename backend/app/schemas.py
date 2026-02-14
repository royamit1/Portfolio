from pydantic import BaseModel, EmailStr, Field


# --- Chat & Interaction ---

class ChatRequest(BaseModel):
    """
    Schema for incoming chat messages from the frontend.
    """
    message: str = Field(..., description="The user's input message.")
    session_id: str = Field(..., description="Unique identifier to maintain conversation context.")


# --- Contact Form ---

class ContactSchema(BaseModel):
    """
    Validation schema for the 'Contact Me' form.
    """
    name: str = Field(..., min_length=1, max_length=100, description="Name of the sender.")
    email: EmailStr = Field(..., description="Valid email address for replies.")
    message: str = Field(..., min_length=10, max_length=500, description="The message content (10-500 chars).")


# --- AI Tool Definitions (LangChain) ---

class KnowledgeBaseToolInput(BaseModel):
    """
    Input schema for the RAG Knowledge Base tool.
    Used by the LLM to structure queries when looking up portfolio information.
    """
    question: str = Field(
        ...,
        description="The user's specific question about Roy Amit's portfolio, skills, or experience."
    )


class ResumeEmailToolInput(BaseModel):
    """
    Input schema for the SendResumeEmail tool.
    Used by the LLM when the user explicitly asks to receive the resume via email.
    """
    recipient: str = Field(
        ...,
        description="The email address where the resume should be sent."
    )
