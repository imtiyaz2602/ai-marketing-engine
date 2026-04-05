from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ai_service import call_claude
import json
import csv
import io

router = APIRouter()

@router.post("/analyse-sentiment")
async def analyse_sentiment(file: UploadFile = File(...)):
    content = await file.read()
    try:
        text = content.decode("utf-8")
        reader = csv.reader(io.StringIO(text))
        rows = list(reader)
        feedback_lines = []
        for row in rows[1:]:  # skip header
            if row:
                feedback_lines.append(row[0])
        feedback_text = "\n".join(feedback_lines[:200])
    except Exception:
        raise HTTPException(status_code=400, detail="Could not parse CSV file")

    prompt = f"""
Analyse the following customer feedback:

{feedback_text}

Return ONLY valid JSON:
{{
  "sentiment_score": {{"positive": 65, "neutral": 20, "negative": 15}},
  "positive_themes": [
    {{"theme": "...", "count": 10}},
    {{"theme": "...", "count": 8}},
    {{"theme": "...", "count": 6}},
    {{"theme": "...", "count": 5}},
    {{"theme": "...", "count": 4}}
  ],
  "negative_themes": [
    {{"theme": "...", "count": 7}},
    {{"theme": "...", "count": 5}},
    {{"theme": "...", "count": 4}},
    {{"theme": "...", "count": 3}},
    {{"theme": "...", "count": 2}}
  ],
  "high_impact_comments": ["comment1", "comment2", "comment3"],
  "campaign_angles": ["angle1", "angle2", "angle3"],
  "voice_of_customer": "One paragraph summarising the customer voice for use in marketing...",
  "word_frequencies": {{"word1": 15, "word2": 12, "word3": 10, "word4": 8, "word5": 7, "word6": 6, "word7": 5, "word8": 4, "word9": 3, "word10": 3}}
}}
"""
    raw = call_claude(prompt)
    try:
        clean = raw.strip().replace("```json","").replace("```","").strip()
        data = json.loads(clean)
    except:
        raise HTTPException(status_code=500, detail="AI analysis failed")

    return data

@router.post("/analyse-sentiment-text")
async def analyse_sentiment_text(payload: dict):
    feedback_text = payload.get("text", "")
    if not feedback_text:
        raise HTTPException(status_code=400, detail="No text provided")

    prompt = f"""
Analyse this customer feedback:

{feedback_text}

Return ONLY valid JSON:
{{
  "sentiment_score": {{"positive": 65, "neutral": 20, "negative": 15}},
  "positive_themes": [
    {{"theme": "...", "count": 10}},
    {{"theme": "...", "count": 8}},
    {{"theme": "...", "count": 6}},
    {{"theme": "...", "count": 5}},
    {{"theme": "...", "count": 4}}
  ],
  "negative_themes": [
    {{"theme": "...", "count": 7}},
    {{"theme": "...", "count": 5}},
    {{"theme": "...", "count": 4}},
    {{"theme": "...", "count": 3}},
    {{"theme": "...", "count": 2}}
  ],
  "high_impact_comments": ["comment1", "comment2", "comment3"],
  "campaign_angles": ["angle1", "angle2", "angle3"],
  "voice_of_customer": "One paragraph summary...",
  "word_frequencies": {{"word1": 15, "word2": 12, "word3": 10, "word4": 8, "word5": 7}}
}}
"""
    raw = call_claude(prompt)
    try:
        clean = raw.strip().replace("```json","").replace("```","").strip()
        data = json.loads(clean)
    except:
        raise HTTPException(status_code=500, detail="AI analysis failed")

    return data
