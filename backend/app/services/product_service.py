from sqlalchemy.orm import Session
from app.models.product_models import Product, ProductCreate
from app.services.embedding_service import get_embedding

def create_product(db: Session, product: ProductCreate):
    embedding = get_embedding(product.description)
    db_product = Product(**product.dict(), embedding=embedding)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).offset(skip).limit(limit).all()

def find_similar_products(db: Session, query: str, limit: int = 5):
    embedding = get_embedding(query)
    return db.query(Product).order_by(Product.embedding.l2_distance(embedding)).limit(limit).all()
