import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"


def call_claude(prompt: str, system: str = "You are an expert marketing copywriter. Always respond with valid JSON only when asked. Never add markdown formatting or code blocks around JSON.") -> str:
    """
    Calls Groq API. Named call_claude so no other file needs changing.
    """
    if not GROQ_API_KEY:
        raise Exception("GROQ_API_KEY not found in .env file. Please add it.")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": system
            },
            {
                "role": "user",
                "content": prompt
            },
        ],
        "max_tokens": 4000,
        "temperature": 0.7,
    }

    try:
        response = requests.post(
            GROQ_API_URL,
            headers=headers,
            json=payload,
            timeout=60
        )

        if response.status_code == 401:
            raise Exception("Invalid Groq API key. Check your .env file.")

        if response.status_code == 429:
            raise Exception("Groq rate limit hit. Wait a moment and try again.")

        if response.status_code != 200:
            raise Exception(f"Groq API error {response.status_code}: {response.text}")

        data = response.json()
        return data["choices"][0]["message"]["content"]

    except requests.exceptions.Timeout:
        raise Exception("Groq API timed out. Try again.")

    except requests.exceptions.ConnectionError:
        raise Exception("Cannot connect to Groq API. Check your internet connection.")


def build_brand_context(brand) -> str:
    """
    Converts brand DB object into a context string injected
    at the top of every AI prompt.
    """
    return f"""
BRAND CONTEXT (You MUST always respect this in every output):
- Brand Name: {brand.name}
- Industry: {brand.industry}
- Target Audience: {brand.target_audience}
- Brand Tone: {', '.join(brand.tone)}
- Always include these keywords: {', '.join(brand.keywords_include)}
- Never use these words: {', '.join(brand.keywords_avoid)}
- Campaign Name: {brand.campaign_name}
- Campaign Goal: {brand.campaign_goal}
- Target Platforms: {', '.join(brand.platforms)}
"""