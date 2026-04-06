# ⚡ AI Marketing Intelligence & Content Engine

> An AI-powered marketing workspace where teams can plan campaigns, generate content across formats, analyse audience sentiment, and repurpose assets — all from one tool.

![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Groq](https://img.shields.io/badge/AI-Groq-orange.svg)

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🚀 **Frontend** | https://ai-marketing-engine-cyan.vercel.app |
| 🎯 **Brand Setup Page** | https://ai-marketing-engine-cyan.vercel.app/brand |
| ⚙️ **Backend API** | https://ai-marketing-engine-k523.onrender.com |
| 📖 **API Docs** | https://ai-marketing-engine-k523.onrender.com/docs |

---

## 🎯 Project Objective

Build an AI-powered marketing workspace where teams can:
- Define brand identity and campaign context
- Generate content across multiple formats in one click
- Repurpose long-form content into shorter formats
- Generate and A/B test ad copy variants
- Analyse audience sentiment from customer reviews
- Manage all content on a visual drag-and-drop calendar

---

## 💡 Why This Project

Marketing teams often rely on multiple disconnected tools for content creation, analysis, and planning.  
This platform consolidates the entire workflow into a single AI-powered system—reducing effort, improving consistency, and accelerating campaign execution.

---

## 🧩 Modules

| Module | Description |
|---|---|
| 🏷️ **Brand & Campaign Setup** | Define brand name, tone, keywords, campaign goals and platforms |
| ✍️ **AI Content Generation Hub** | Generate LinkedIn, Instagram, Twitter, Email, Blog, Ads, SEO |
| ♻️ **Content Repurposing Engine** | Upload long-form content and extract value across formats |
| 📢 **AI Ad Copy & A/B Testing** | Generate 5 ad variants with tone labels and AI recommendation |
| 📊 **Sentiment Intelligence** | Analyse customer reviews with pie chart, word cloud and themes |
| 📅 **Campaign Content Calendar** | Drag and drop content onto dates with gap detection |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, React Router, Recharts, DnD Kit, PapaParse |
| **Backend** | FastAPI, Python 3.11, SQLite, SQLAlchemy |
| **AI / LLM** | Groq API — llama-3.3-70b-versatile |
| **Deployment** | Vercel (Frontend) + Render (Backend) |

---

## 🧠 Architecture Overview

```
React Frontend (UI + State Management)
        ↓ REST API
FastAPI Backend (Business Logic)
        ↓
AI Service Layer (Groq LLM Integration)
        ↓
SQLite Database (Content + Campaign Storage)
```

---

## ✨ Features

- ⚡ Multi-platform content generation (LinkedIn, Instagram, Twitter, Email, Blog, Ads, SEO)
- 🎯 Brand-aware AI — outputs follow tone and keywords
- ♻️ Content repurposing with coverage map and insights
- 📊 Sentiment analysis with pie chart and word cloud
- 📢 A/B testing with 5 ad variants and AI recommendation
- 📅 Drag and drop content calendar with gap detection
- 🔄 Regenerate content with refinement instructions
- 💾 Save content directly to calendar
- 📥 Export ad variants as CSV

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.11
- Node.js 18+
- Groq API Key — https://console.groq.com

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

Create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Start backend:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

App runs at: **http://localhost:3000**  
API docs at: **http://localhost:8000/docs**

---

## 📁 Project Structure

```
ai-marketing-engine/
├── backend/
│   ├── routers/
│   │   ├── brand.py
│   │   ├── content.py
│   │   ├── repurpose.py
│   │   ├── ads.py
│   │   ├── sentiment.py
│   │   └── calendar.py
│   ├── services/
│   │   └── ai_service.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        └── context/
```

---

## ⚠️ Known Limitations

- No user authentication — single user mode only  
- Free Render backend spins down after inactivity (~50s delay on first request)  
- Calendar does not export to PDF yet  
- No real-time streaming for AI responses  

---

## 🔮 Future Improvements

- Add user authentication for multi-brand support  
- Implement real-time streaming responses  
- Add competitor content analysis module  
- Build AI tone consistency scoring system  
- Add PDF export for content calendar  
- Improve mobile responsiveness  

---

## 👨‍💻 Built By

**Mohammad Imtiyaz Khan**  
AI Marketing Intelligence & Content Engine  

---

## 📄 License

MIT License
