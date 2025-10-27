from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base
from pydantic import BaseModel, EmailStr, Field
from pgvector.sqlalchemy import Vector
from typing import Optional

# Email model
class EmailSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=1000)

# Product model
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    embedding = Column(Vector(384)) # Assuming embedding size of 384

class ProductCreate(BaseModel):
    name: str
    description: str

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        from_attributes = True

class ProductResponseWithEmbedding(ProductResponse):
    embedding: Optional[list[float]]
