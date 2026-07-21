from app.embeddings.bge import BGEEmbeddingModel


class EmbeddingService:
    """Handles text embedding generation."""

    def __init__(self):
        self.model = BGEEmbeddingModel()

    def embed_documents(
        self,
        texts: list[str],
    ) -> list[list[float]]:
        return self.model.embed(texts)

    def embed_query(
        self,
        query: str,
    ) -> list[float]:

        return self.model.embed([query])[0]