from app.embeddings.bge import BGEEmbeddingModel


class EmbeddingService:
    """Handles text embedding generation."""

    def __init__(self):
        self.model = BGEEmbeddingModel()

    def embed(
        self,
        texts: list[str],
    ) -> list[list[float]]:

        return self.model.embed(texts)