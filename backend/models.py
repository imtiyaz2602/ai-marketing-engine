from sqlalchemy import Column, Integer, String, Text, JSON
from database import Base

class Brand(Base):
    __tablename__ = "brands"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    industry = Column(String)
    target_audience = Column(Text)
    tone = Column(JSON)
    keywords_include = Column(JSON)
    keywords_avoid = Column(JSON)
    campaign_name = Column(String)
    campaign_goal = Column(String)
    duration = Column(String)
    platforms = Column(JSON)

class ContentPiece(Base):
    __tablename__ = "content_pieces"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    content = Column(Text)
    platform = Column(String)
    status = Column(String, default="Draft")
    scheduled_date = Column(String, nullable=True)
    brand_id = Column(Integer, nullable=True)
    source = Column(String, default="generated")

class AdVariant(Base):
    __tablename__ = "ad_variants"
    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String)
    description = Column(Text)
    tone_label = Column(String)
    platform = Column(String)
    status = Column(String, default="Testing")
    brand_id = Column(Integer, nullable=True)
    is_recommended = Column(Integer, default=0)
    reasoning = Column(Text, nullable=True)