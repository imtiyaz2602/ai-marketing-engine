from pydantic import BaseModel
from typing import List, Optional

class BrandCreate(BaseModel):
    name: str
    industry: str
    target_audience: str
    tone: List[str]
    keywords_include: List[str]
    keywords_avoid: List[str]
    campaign_name: str
    campaign_goal: str
    duration: str
    platforms: List[str]

    class Config:
        orm_mode = True

class BrandOut(BrandCreate):
    id: int

    class Config:
        orm_mode = True

class ContentRequest(BaseModel):
    topic: str
    brand_id: int

class RepurposeRequest(BaseModel):
    asset_name: str
    content: str
    brand_id: int

class AdRequest(BaseModel):
    product: str
    audience: str
    platform: str
    goal: str
    brand_id: int

class CalendarUpdate(BaseModel):
    status: Optional[str] = None
    scheduled_date: Optional[str] = None

class AdStatusUpdate(BaseModel):
    status: str
