from sentence_transformers import SentenceTransformer

from app.embeddings.base import BaseEmbeddingModel

_model = SentenceTransformer("BAAI/bge-base-en-v1.5")


class BGEEmbeddingModel(BaseEmbeddingModel):
    """Local BGE embedding model."""

    def embed(
        self,
        texts: list[str],
    ) -> list[list[float]]:

        embeddings = _model.encode(
            texts,
            normalize_embeddings=True,
            convert_to_numpy=True,
            show_progress_bar=False,
        )

        return embeddings.tolist()