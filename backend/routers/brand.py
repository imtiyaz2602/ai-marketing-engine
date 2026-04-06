from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Brand
from schemas import BrandCreate, BrandOut
from services.ai_service import call_claude

router = APIRouter()

@router.post("/brand", response_model=BrandOut)
def create_brand(brand: BrandCreate, db: Session = Depends(get_db)):
    db_brand = Brand(**brand.dict())
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand

@router.get("/brand/{brand_id}", response_model=BrandOut)
def get_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@router.get("/brands", response_model=List[BrandOut])
def get_all_brands(db: Session = Depends(get_db)):
    return db.query(Brand).all()

@router.post("/brand/validate")
def validate_brand(brand: BrandCreate):
    warnings = []
    if "Playful" in brand.tone and "LinkedIn" in brand.platforms:
        warnings.append("Playful tone may underperform on LinkedIn.")
    if "Witty" in brand.tone and "Google Ads" in brand.platforms:
        warnings.append("Witty tone can reduce CTR on Google Ads.")
    if not warnings:
        prompt = f"Brand '{brand.name}' in '{brand.industry}' uses tones: {', '.join(brand.tone)} on {', '.join(brand.platforms)}. In 1-2 sentences give one tip."
        ai_tip = call_claude(prompt)
        warnings.append(ai_tip.strip())
    return {"warnings": warnings}

@router.put("/brand/{brand_id}", response_model=BrandOut)
def update_brand(brand_id: int, brand: BrandCreate, db: Session = Depends(get_db)):
    db_brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not db_brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    for key, value in brand.dict().items():
        setattr(db_brand, key, value)
    db.commit()
    db.refresh(db_brand)
    return db_brand

@router.delete("/brand/{brand_id}")
def delete_brand(brand_id: int, db: Session = Depends(get_db)):
    db_brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not db_brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    db.delete(db_brand)
    db.commit()
    return {"message": "Brand deleted"}
