from app.repositories.chunk_repository import ChunkRepository
from app.repositories.document_repository import DocumentRepository
from app.services.embedding_service import EmbeddingService
from app.vectorstore.qdrant_repository import QdrantRepository


class SearchService:
    """Handles semantic search over document chunks."""

    def __init__(
        self,
        chunk_repository: ChunkRepository,
    ):
        self.chunk_repository = chunk_repository
        self.document_repository = DocumentRepository(
            chunk_repository.db
        )
        self.embedding_service = EmbeddingService()
        self.qdrant_repository = QdrantRepository()

    def search(
        self,
        query: str,
        top_k: int = 5,
        document_id: str | None = None,
    ):
        # Step 1: Embed the user's query
        query_embedding = self.embedding_service.embed_query(query)

        # Step 2: Search Qdrant
        vector_results = self.qdrant_repository.search(
            query_embedding=query_embedding,
            top_k=top_k,
            document_id=document_id,
        )

        if not vector_results:
            return []

        # Step 3: Extract chunk IDs
        chunk_ids = [
            str(result.id)
            for result in vector_results
        ]

        # Step 4: Fetch chunks from SQLite
        chunks = self.chunk_repository.get_chunks_by_ids(chunk_ids)

        # Step 5: Fetch corresponding documents
        document_ids = list(
            {
                str(chunk.document_id)
                for chunk in chunks
            }
        )

        documents = self.document_repository.get_documents_by_ids(
            document_ids
        )

        document_lookup = {
            str(document.id): document
            for document in documents
        }

        # Step 6: Create chunk lookup
        chunk_lookup = {
            str(chunk.id): chunk
            for chunk in chunks
        }

        # Step 7: Preserve Qdrant ranking
        results = []

        for result in vector_results:
            chunk = chunk_lookup.get(str(result.id))

            if chunk is None:
                continue

            document = document_lookup[str(chunk.document_id)]

            results.append(
                {
                    "chunk_id": str(chunk.id),
                    "document_id": str(chunk.document_id),
                    "document_name": document.original_filename,
                    "chunk_index": chunk.chunk_index,
                    "content": chunk.content,
                    "score": float(result.score),
                }
            )

        return results