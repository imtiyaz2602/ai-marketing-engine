from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Brand, AdVariant
from schemas import AdRequest, AdStatusUpdate
from services.ai_service import call_claude, build_brand_context
import json

router = APIRouter()

@router.post("/generate-ads")
def generate_ads(req: AdRequest, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == req.brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    brand_ctx = build_brand_context(brand)
    prompt = f"""
{brand_ctx}

Generate 5 ad copy variants for:
- Product/Service: {req.product}
- Target Audience: {req.audience}
- Platform: {req.platform}
- Goal: {req.goal}

Each variant must use a different persuasion angle.
Return ONLY valid JSON:
{{
  "variants": [
    {{"headline": "...", "description": "...", "tone_label": "Emotional", "reasoning": "..."}},
    {{"headline": "...", "description": "...", "tone_label": "Logical", "reasoning": "..."}},
    {{"headline": "...", "description": "...", "tone_label": "Urgency", "reasoning": "..."}},
    {{"headline": "...", "description": "...", "tone_label": "Social Proof", "reasoning": "..."}},
    {{"headline": "...", "description": "...", "tone_label": "Curiosity", "reasoning": "..."}}
  ],
  "recommended_index": 0,
  "recommendation_reason": "One sentence explaining why this variant will perform best on {req.platform}"
}}
"""
    raw = call_claude(prompt)
    try:
        clean = raw.strip().replace("```json","").replace("```","").strip()
        data = json.loads(clean)
    except:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")

    saved_ids = []
    for i, v in enumerate(data["variants"]):
        ad = AdVariant(
            headline=v["headline"],
            description=v["description"],
            tone_label=v["tone_label"],
            platform=req.platform,
            brand_id=req.brand_id,
            status="Testing",
            is_recommended=1 if i == data.get("recommended_index", 0) else 0,
            reasoning=v.get("reasoning", "")
        )
        db.add(ad)
        db.commit()
        db.refresh(ad)
        saved_ids.append(ad.id)

    return {
        "variants": data["variants"],
        "recommended_index": data.get("recommended_index", 0),
        "recommendation_reason": data.get("recommendation_reason", ""),
        "saved_ids": saved_ids
    }

@router.get("/ads")
def get_ads(db: Session = Depends(get_db)):
    ads = db.query(AdVariant).all()
    return ads

@router.patch("/ads/{ad_id}/status")
def update_ad_status(ad_id: int, update: AdStatusUpdate, db: Session = Depends(get_db)):
    ad = db.query(AdVariant).filter(AdVariant.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    ad.status = update.status
    db.commit()
    return {"message": "Status updated", "status": update.status}

@router.get("/ads/export")
def export_ads(db: Session = Depends(get_db)):
    ads = db.query(AdVariant).all()
    rows = [["ID","Headline","Description","Tone","Platform","Status","Recommended"]]
    for ad in ads:
        rows.append([
            ad.id, ad.headline, ad.description,
            ad.tone_label, ad.platform, ad.status,
            "Yes" if ad.is_recommended else "No"
        ])
    return {"data": rows}
