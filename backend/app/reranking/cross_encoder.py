from sentence_transformers import CrossEncoder


class CrossEncoderReranker:
    """Reranks retrieved chunks using a cross-encoder."""

    SCORE_GAP_THRESHOLD = 4.0
    MIN_RERANK_SCORE = 0.0

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

        reranked = reranked[:top_k]
        # -------------------------
        # Absolute relevance check
        # -------------------------

        if (
            not reranked
            or reranked[0]["rerank_score"]
            < self.MIN_RERANK_SCORE
        ):
            return []

        # -------------------------
        # Adaptive relevance cutoff
        # -------------------------

        if len(reranked) <= 1:
            return reranked

        selected = [reranked[0]]

        for current in reranked[1:]:
            previous = selected[-1]

            score_gap = (
                previous["rerank_score"]
                - current["rerank_score"]
            )

            if score_gap >= self.SCORE_GAP_THRESHOLD:
                break

            selected.append(current)

        return selected