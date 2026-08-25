from groq import Groq

from app.core.config import settings


class GroundingValidator:
    """Checks whether an answer is sufficiently supported by retrieved context."""

    def __init__(self):
        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

    def validate(
        self,
        answer: str,
        context: str,
    ) -> bool:

        if not answer.strip() or not context.strip():
            return False

        prompt = f"""
You are a factual grounding evaluator for a Retrieval-Augmented
Generation system.

Your task is to determine whether the ANSWER is sufficiently
supported by the RETRIEVED CONTEXT.

## Rules

- Use ONLY the Retrieved Context as evidence.
- Do NOT use general knowledge.
- Evaluate the meaning of each factual claim, not exact wording.
- Paraphrases of information in the context are considered supported.
- A reasonable synthesis of multiple statements in the context
  is considered supported.
- Ignore formatting, headings, examples, and stylistic differences.
- Do not require the answer to repeat the context word-for-word.
- If the answer contains a major factual claim that contradicts
  the context or is clearly not supported by it, return NO.
- Minor wording differences should NOT cause rejection.
- If the answer is broadly and factually grounded in the context,
  return YES.
- Return ONLY YES or NO.

## Retrieved Context

{context}

---

## Answer

{answer}

---

## Verdict
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

            verdict = (
                response.choices[0]
                .message.content
                .strip()
                .upper()
            )

            print(
                f"Grounding validator verdict: {verdict}"
            )

            return verdict.startswith("YES")

        except Exception as exc:
            print(
                f"Grounding validator error: {exc}"
            )

            # Fail closed if validation itself fails.
            return False