from qdrant_client.http.models import PointStruct

from app.core.config import settings
from app.models.document_chunk import DocumentChunk
from app.vectorstore.qdrant_client import client


class QdrantRepository:
    """Handles vector storage in Qdrant."""

    def __init__(self):
        self.client = client

    def insert_embeddings(
        self,
        chunks: list[DocumentChunk],
        embeddings: list[list[float]],
    ) -> None:

        if len(chunks) != len(embeddings):
            raise ValueError(
                "Number of chunks and embeddings must be equal."
            )

        points = []

        for chunk, embedding in zip(chunks, embeddings):

            points.append(
                PointStruct(
                    id=str(chunk.id),
                    vector=embedding,
                    payload={
                        "document_id": str(chunk.document_id),
                        "chunk_index": chunk.chunk_index,
                    },
                )
            )

        self.client.upsert(
            collection_name=settings.QDRANT_COLLECTION,
            points=points,
        )