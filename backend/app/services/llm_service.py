from collections.abc import Generator

from groq import Groq

from app.core.config import settings


class LLMService:
    """Handles communication with the Groq LLM."""

    def __init__(self):
        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

    def _messages(
        self,
        prompt: str,
    ) -> list[dict]:
        """Build chat messages."""

        return [
            {
                "role": "user",
                "content": prompt,
            }
        ]

    def generate(
        self,
        prompt: str,
    ) -> str:
        """Generate a complete response."""

        try:
            response = (
                self.client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=self._messages(prompt),
                )
            )

            return (
                response.choices[0]
                .message.content
            )

        except Exception as e:
            raise RuntimeError(
                f"LLM generation failed: {e}"
            )

    def stream(
        self,
        prompt: str,
    ) -> Generator[str, None, None]:
        """Stream the response token-by-token."""

        try:
            stream = (
                self.client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=self._messages(prompt),
                    stream=True,
                )
            )

            for chunk in stream:
                delta = (
                    chunk.choices[0]
                    .delta.content
                )

                if delta:
                    print(repr(delta), flush=True)
                    yield delta

        except Exception as e:
            raise RuntimeError(
                f"LLM streaming failed: {e}"
            )