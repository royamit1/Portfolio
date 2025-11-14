from pydantic import BaseModel, Field, EmailStr


class EmailToolInput(BaseModel):
    recipient: EmailStr = Field(description="The email address of the recipient.")
    subject: str = Field(description="The subject line of the email.")
    body: str = Field(description="The main content/body of the email.")
