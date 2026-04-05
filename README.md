# ⚡ AI Marketing Intelligence & Content Engine

An AI-powered marketing workspace where teams can plan campaigns, generate content across all formats, analyse audience sentiment, and repurpose assets — all from one tool.

## 🚀 Tech Stack
- **Frontend:** React.js, React Router, Recharts, DnD Kit, PapaParse
- **Backend:** FastAPI (Python), SQLite, SQLAlchemy
- **AI:** Claude API (claude-sonnet-4-20250514)

## ✨ Features
- **Module 1:** Brand & Campaign Setup with AI tone validation
- **Module 2:** Multi-format content generation (LinkedIn, Instagram, Twitter, Email, Blog, Ads, SEO)
- **Module 3:** Content Repurposing Engine with coverage map
- **Module 4:** AI Ad Copy & A/B Testing with 5 variants
- **Module 5:** Audience Sentiment Intelligence with word cloud
- **Module 6:** Drag-and-drop Campaign Content Calendar

## ⚙️ How to Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
# Add your API key to .env: ANTHROPIC_API_KEY=your_key_here
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm start
```

App runs at: http://localhost:3000  
API docs at: http://localhost:8000/docs

## 🔑 Environment Variables
Create `backend/.env`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## 📸 Screenshots
_Add screenshots here after running the app_

## ⚠️ Known Limitations
- No user authentication (single-user mode)
- Calendar export to PDF not yet implemented
- Word cloud uses basic frequency-based sizing
