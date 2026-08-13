from app.repositories.chunk_repository import ChunkRepository
from app.repositories.document_repository import DocumentRepository
from app.services.embedding_service import EmbeddingService
from app.vectorstore.qdrant_repository import QdrantRepository
from app.reranking.cross_encoder import CrossEncoderReranker


class SearchService:
    """Handles semantic search and reranking over document chunks."""

    SIMILARITY_THRESHOLD = 0.60

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
        self.reranker = CrossEncoderReranker()

    def search(
        self,
        query: str,
        top_k: int = 5,
        document_id: str | None = None,
    ):
        # Retrieve more candidates before reranking.
        retrieval_k = max(top_k * 2, 10)

        # Step 1: Embed the user's query
        query_embedding = self.embedding_service.embed_query(query)

        # Step 2: Search Qdrant
        vector_results = self.qdrant_repository.search(
            query_embedding=query_embedding,
            top_k=retrieval_k,
            document_id=document_id,
        )

        if not vector_results:
            return []

        # Step 3: Remove weak semantic matches
        vector_results = [
            result
            for result in vector_results
            if float(result.score) >= self.SIMILARITY_THRESHOLD
        ]

        if not vector_results:
            return []

        # Step 4: Extract chunk IDs
        chunk_ids = [
            str(result.id)
            for result in vector_results
        ]

        # Step 5: Fetch chunks from SQLite
        chunks = self.chunk_repository.get_chunks_by_ids(
            chunk_ids
        )

        # Step 6: Fetch corresponding documents
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

        # Step 7: Create chunk lookup
        chunk_lookup = {
            str(chunk.id): chunk
            for chunk in chunks
        }

        # Step 8: Build results
        results = []

        for result in vector_results:
            chunk = chunk_lookup.get(str(result.id))

            if chunk is None:
                continue

            document = document_lookup.get(
                str(chunk.document_id)
            )

            if document is None:
                continue

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

        # Step 9: Rerank candidates using CrossEncoder
        return self.reranker.rerank(
            query=query,
            results=results,
            top_k=top_k,
        )