from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Brand, ContentPiece
from schemas import ContentRequest
from services.ai_service import call_claude, build_brand_context
import json

router = APIRouter()

def build_content_prompt(brand_ctx: str, topic: str, refinement: str = "") -> str:
    refine_note = f"\nAdditional instruction: {refinement}" if refinement else ""
    return f"""
{brand_ctx}

TASK: Generate a complete multi-format content package for this topic: "{topic}"{refine_note}

Return ONLY a valid JSON object with exactly this structure (no markdown, no explanation):
{{
  "linkedin": [
    {{"type": "thought_leadership", "content": "..."}},
    {{"type": "story_based", "content": "..."}},
    {{"type": "direct_cta", "content": "..."}}
  ],
  "instagram": [
    {{"variant": "with_emojis", "caption": "...", "hashtags": ["tag1","tag2","tag3"]}},
    {{"variant": "without_emojis", "caption": "...", "hashtags": ["tag1","tag2","tag3"]}}
  ],
  "twitter": [
    {{"angle": "stat", "content": "..."}},
    {{"angle": "question", "content": "..."}},
    {{"angle": "hot_take", "content": "..."}},
    {{"angle": "tip", "content": "..."}},
    {{"angle": "announcement", "content": "..."}}
  ],
  "video_scripts": [
    {{"duration": "30sec", "hook": "...", "body": "...", "cta": "..."}},
    {{"duration": "60sec", "hook": "...", "body": "...", "cta": "..."}}
  ],
  "email": {{
    "subject_line": "...",
    "body": "...",
    "cta": "..."
  }},
  "blog_outline": {{
    "h1": "...",
    "sections": [
      {{"h2": "...", "key_points": ["point1","point2"], "word_count": 200}}
    ]
  }},
  "google_ads": [
    {{"headline": "...", "description": "..."}},
    {{"headline": "...", "description": "..."}},
    {{"headline": "...", "description": "..."}}
  ],
  "seo_meta": {{
    "title": "...",
    "description": "..."
  }}
}}
"""

@router.post("/generate-content")
def generate_content(req: ContentRequest, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == req.brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    brand_ctx = build_brand_context(brand)
    prompt = build_content_prompt(brand_ctx, req.topic)
    raw = call_claude(prompt)
    
    try:
        clean = raw.strip().replace("```json", "").replace("```", "").strip()
        data = json.loads(clean)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Try again.")
    
    return data

@router.post("/regenerate-piece")
def regenerate_piece(payload: dict, db: Session = Depends(get_db)):
    brand_id = payload.get("brand_id")
    piece_type = payload.get("piece_type")
    original = payload.get("original_content")
    refinement = payload.get("refinement", "")
    
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    brand_ctx = build_brand_context(brand)
    instruction = refinement if refinement else "Generate a fresh variant"
    
    prompt = f"""
{brand_ctx}

Original {piece_type} content:
{original}

Task: {instruction}. Return only the new content text, nothing else.
"""
    result = call_claude(prompt)
    return {"content": result.strip()}

@router.post("/content-pieces")
def save_content_piece(payload: dict, db: Session = Depends(get_db)):
    piece = ContentPiece(
        type=payload.get("type"),
        content=payload.get("content"),
        platform=payload.get("platform"),
        brand_id=payload.get("brand_id"),
        status="Draft"
    )
    db.add(piece)
    db.commit()
    db.refresh(piece)
    return {"id": piece.id, "message": "Saved to calendar"}

@router.get("/content-pieces")
def get_content_pieces(db: Session = Depends(get_db)):
    return db.query(ContentPiece).all()
