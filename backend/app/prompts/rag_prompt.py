def build_rag_prompt(
    context: str,
    question: str,
) -> str:
    return f"""
You are an AI assistant that answers questions using only the provided context.

If the answer cannot be found in the context, say:
"I couldn't find that information in the provided documents."

Context:
{context}

Question:
{question}

Answer:
"""