from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Brand
from schemas import RepurposeRequest
from services.ai_service import call_claude, build_brand_context
import json

router = APIRouter()

@router.post("/repurpose")
def repurpose_content(req: RepurposeRequest, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == req.brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    brand_ctx = build_brand_context(brand)

    extract_prompt = f"""
{brand_ctx}

Analyse the following long-form content titled "{req.asset_name}":

{req.content}

Return ONLY valid JSON with this structure:
{{
  "top_insights": ["insight1", "insight2", "insight3", "insight4", "insight5"],
  "quotable_lines": ["quote1", "quote2", "quote3"],
  "main_argument": "One paragraph summary of the main argument",
  "coverage_map": [
    {{"section": "Opening/Introduction", "usage_percent": 30}},
    {{"section": "Main Body", "usage_percent": 50}},
    {{"section": "Conclusion", "usage_percent": 20}}
  ]
}}
"""
    raw_extract = call_claude(extract_prompt)
    try:
        clean = raw_extract.strip().replace("```json","").replace("```","").strip()
        extracted = json.loads(clean)
    except:
        raise HTTPException(status_code=500, detail="Extraction failed")

    content_prompt = f"""
{brand_ctx}

Based ONLY on this content titled "{req.asset_name}":
{req.content}

Generate all formats. Every piece must end with: "Based on {req.asset_name}"

Return ONLY valid JSON:
{{
  "linkedin": [
    {{"type": "thought_leadership", "content": "..."}},
    {{"type": "story_based", "content": "..."}},
    {{"type": "direct_cta", "content": "..."}}
  ],
  "instagram": [
    {{"variant": "with_emojis", "caption": "...", "hashtags": ["tag1"]}},
    {{"variant": "without_emojis", "caption": "...", "hashtags": ["tag1"]}}
  ],
  "twitter": [
    {{"angle": "stat", "content": "..."}},
    {{"angle": "question", "content": "..."}},
    {{"angle": "hot_take", "content": "..."}},
    {{"angle": "tip", "content": "..."}},
    {{"angle": "announcement", "content": "..."}}
  ],
  "email": {{
    "subject_line": "...",
    "body": "...",
    "cta": "..."
  }},
  "blog_outline": {{
    "h1": "...",
    "sections": [{{"h2": "...", "key_points": ["..."], "word_count": 200}}]
  }}
}}
"""
    raw_content = call_claude(content_prompt)
    try:
        clean2 = raw_content.strip().replace("```json","").replace("```","").strip()
        generated = json.loads(clean2)
    except:
        raise HTTPException(status_code=500, detail="Content generation failed")

    return {
        "extracted": extracted,
        "generated": generated,
        "asset_name": req.asset_name
    }
