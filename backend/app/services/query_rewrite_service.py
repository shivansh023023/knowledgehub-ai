from groq import Groq

from app.core.config import settings


class QueryRewriteService:
    """Rewrites conversational questions into standalone search queries."""

    def __init__(self):
        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

    def rewrite(
        self,
        question: str,
        history: str = "",
    ) -> str:

        # No history means the question is already standalone.
        if not history.strip():
            return question.strip()

        prompt = f"""
You are a search query rewriting assistant.

Rewrite the user's latest question into a standalone
search query that can be used to retrieve information
from a knowledge base.

Rules:
- Resolve references such as "it", "this", "that", "they", etc.
- Use the conversation history only to understand the reference.
- Do not answer the question.
- Do not add information that is not present in the conversation.
- Keep the rewritten query concise.
- Return ONLY the rewritten search query.
- Do not use quotes.
- Do not explain your reasoning.

Conversation History:
{history}

Latest User Question:
{question}

Standalone Search Query:
"""

        try:
            response = self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                temperature=0,
            )

            rewritten = (
                response.choices[0]
                .message.content
                .strip()
            )

            return rewritten or question.strip()

        except Exception:
            # Retrieval should still work if rewriting fails.
            return question.strip()
