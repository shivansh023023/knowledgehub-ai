from sentence_transformers import CrossEncoder


class CrossEncoderReranker:
    """Reranks retrieved chunks using a cross-encoder."""

    def __init__(self):
        self.model = CrossEncoder(
            "cross-encoder/ms-marco-MiniLM-L-6-v2"
        )

    def rerank(
        self,
        query: str,
        results: list[dict],
        top_k: int = 5,
    ) -> list[dict]:

        if not results:
            return []

        pairs = [
            (query, result["content"])
            for result in results
        ]

        scores = self.model.predict(pairs)

        reranked = []

        for result, score in zip(results, scores):
            reranked.append(
                {
                    **result,
                    "rerank_score": float(score),
                }
            )

        reranked.sort(
            key=lambda result: result["rerank_score"],
            reverse=True,
        )

        return reranked[:top_k]
