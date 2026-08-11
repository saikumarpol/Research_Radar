import os

import httpx
from dotenv import load_dotenv


load_dotenv()


OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)

OPENROUTER_MODEL = os.getenv(
    "OPENROUTER_MODEL",
    "openai/gpt-oss-120b:free",
)

OPENROUTER_URL = (
    "https://openrouter.ai/api/v1/chat/completions"
)


async def generate_ai_response(
    prompt: str,
) -> str:

    if not OPENROUTER_API_KEY:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not configured."
        )

    payload = {
        "model": OPENROUTER_MODEL,

        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an academic research "
                    "summarization assistant. "
                    "Return only the requested summary."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],

        "temperature": 0.2,

        "max_tokens": 500,
    }

    headers = {
        "Authorization": (
            f"Bearer {OPENROUTER_API_KEY}"
        ),

        "Content-Type": "application/json",

        "HTTP-Referer": (
            "http://localhost:3000"
        ),

        "X-Title": (
            "Research Radar"
        ),
    }

    async with httpx.AsyncClient(
        timeout=90.0
    ) as client:

        response = await client.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
        )

    if response.status_code != 200:

        raise RuntimeError(
            f"OpenRouter API error "
            f"{response.status_code}: "
            f"{response.text}"
        )

    data = response.json()

    # Useful debugging
    print(
        "[AI] Requested model:",
        OPENROUTER_MODEL,
    )

    print(
        "[AI] Actual model:",
        data.get("model"),
    )

    try:

        content = (
            data["choices"][0]
            ["message"]
            ["content"]
        )

    except (
        KeyError,
        IndexError,
        TypeError,
    ):

        raise RuntimeError(
            "Invalid response received from OpenRouter."
        )

    if not content:
        raise RuntimeError(
            "OpenRouter returned an empty response."
        )

    return content.strip()