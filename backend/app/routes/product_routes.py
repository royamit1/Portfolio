from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.product_models import ProductCreate, ProductResponse, EmailSchema
from app.services import product_service
from app.services.email_service import send_contact_email
import logging
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

class QueryRequest(BaseModel):
    query: str

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/contact")
async def contact(message: EmailSchema, background_tasks: BackgroundTasks):
    """
    Handles incoming contact form submissions and queues email sending.
    """
    try:
        logger.info(f"Contact form submitted by: {message.name} ({message.email})")

        subject = f"New Portfolio Contact from {message.name}"
        await send_contact_email(background_tasks, subject, message)

        return {
            "status": "success",
            "message": "Thank you for your message! I'll get back to you soon."
        }
    except Exception as e:
        logger.error(f"Error processing contact message: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send message. Please try again or contact me directly."
        )

@router.post("/products/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_product(db=db, product=product)

@router.get("/products/", response_model=list[ProductResponse])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = product_service.get_products(db, skip=skip, limit=limit)
    return products

@router.get("/products/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = product_service.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.post("/products/search", response_model=list[ProductResponse])
def search_products(request: QueryRequest, db: Session = Depends(get_db)):
    return product_service.find_similar_products(db=db, query=request.query)
