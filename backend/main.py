from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import brand, content, repurpose, ads, sentiment, calendar

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Marketing Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(brand.router, prefix="/api", tags=["Brand"])
app.include_router(content.router, prefix="/api", tags=["Content"])
app.include_router(repurpose.router, prefix="/api", tags=["Repurpose"])
app.include_router(ads.router, prefix="/api", tags=["Ads"])
app.include_router(sentiment.router, prefix="/api", tags=["Sentiment"])
app.include_router(calendar.router, prefix="/api", tags=["Calendar"])

@app.get("/")
def root():
    return {"message": "AI Marketing Engine API is running!"}
