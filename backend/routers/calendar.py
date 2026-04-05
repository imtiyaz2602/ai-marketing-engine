from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import ContentPiece
from schemas import CalendarUpdate
from services.ai_service import call_claude

router = APIRouter()

@router.get("/calendar")
def get_calendar(db: Session = Depends(get_db)):
    pieces = db.query(ContentPiece).all()
    return pieces

@router.patch("/calendar/{piece_id}")
def update_calendar_item(piece_id: int, update: CalendarUpdate, db: Session = Depends(get_db)):
    piece = db.query(ContentPiece).filter(ContentPiece.id == piece_id).first()
    if not piece:
        raise HTTPException(status_code=404, detail="Content piece not found")
    if update.status:
        piece.status = update.status
    if update.scheduled_date is not None:
        piece.scheduled_date = update.scheduled_date
    db.commit()
    return {"message": "Updated", "id": piece_id}

@router.post("/calendar/suggest-schedule")
def suggest_schedule(payload: dict):
    platforms = payload.get("platforms", [])
    duration = payload.get("duration", "4 weeks")
    prompt = f"""
You are a social media strategist. Suggest an optimal posting schedule for these platforms: {', '.join(platforms)} over {duration}.

Return a JSON list:
[
  {{"platform": "LinkedIn", "day": "Monday", "time": "9:00 AM", "reason": "..."}},
  {{"platform": "Instagram", "day": "Wednesday", "time": "6:00 PM", "reason": "..."}},
  {{"platform": "Twitter", "day": "Tuesday", "time": "12:00 PM", "reason": "..."}}
]
Return ONLY valid JSON.
"""
    raw = call_claude(prompt)
    import json
    try:
        clean = raw.strip().replace("```json","").replace("```","").strip()
        data = json.loads(clean)
    except:
        data = []
    return {"schedule": data}

@router.delete("/calendar/{piece_id}")
def delete_calendar_item(piece_id: int, db: Session = Depends(get_db)):
    piece = db.query(ContentPiece).filter(ContentPiece.id == piece_id).first()
    if not piece:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(piece)
    db.commit()
    return {"message": "Deleted"}
