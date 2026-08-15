from app.repositories.chunk_repository import ChunkRepository
from app.repositories.document_repository import DocumentRepository
from app.services.embedding_service import EmbeddingService
from app.vectorstore.qdrant_repository import QdrantRepository
from app.reranking.cross_encoder import CrossEncoderReranker


class SearchService:
    """Handles hybrid semantic + keyword search with reranking."""

    SIMILARITY_THRESHOLD = 0.60
    RRF_K = 60

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

    def _rrf_score(self, rank: int) -> float:
        return 1.0 / (self.RRF_K + rank)

    def _semantic_search(
        self,
        query: str,
        top_k: int,
        document_id: str | None = None,
    ) -> list:

        query_embedding = (
            self.embedding_service.embed_query(query)
        )

        vector_results = (
            self.qdrant_repository.search(
                query_embedding=query_embedding,
                top_k=top_k,
                document_id=document_id,
            )
        )

        if not vector_results:
            return []

        vector_results = [
            result
            for result in vector_results
            if float(result.score)
            >= self.SIMILARITY_THRESHOLD
        ]

        if not vector_results:
            return []

        chunk_ids = [
            str(result.id)
            for result in vector_results
        ]

        chunks = (
            self.chunk_repository
            .get_chunks_by_ids(chunk_ids)
        )

        chunk_lookup = {
            str(chunk.id): chunk
            for chunk in chunks
        }

        document_ids = list(
            {
                str(chunk.document_id)
                for chunk in chunks
            }
        )

        documents = (
            self.document_repository
            .get_documents_by_ids(document_ids)
        )

        document_lookup = {
            str(document.id): document
            for document in documents
        }

        results = []

        for result in vector_results:
            chunk = chunk_lookup.get(
                str(result.id)
            )

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

        return results

    def _keyword_results_to_dicts(
        self,
        chunks: list,
    ) -> list:

        if not chunks:
            return []

        document_ids = list(
            {
                str(chunk.document_id)
                for chunk in chunks
            }
        )

        documents = (
            self.document_repository
            .get_documents_by_ids(document_ids)
        )

        document_lookup = {
            str(document.id): document
            for document in documents
        }

        results = []

        for chunk in chunks:
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
                    "score": 0.0,
                }
            )

        return results

    def _merge_results(
        self,
        semantic_results: list,
        keyword_results: list,
    ) -> list:

        merged = {}

        # Semantic ranking
        for rank, result in enumerate(
            semantic_results,
            start=1,
        ):
            chunk_id = result["chunk_id"]

            if chunk_id not in merged:
                merged[chunk_id] = {
                    **result,
                    "rrf_score": 0.0,
                }

            merged[chunk_id]["rrf_score"] += (
                self._rrf_score(rank)
            )

        # Keyword ranking
        for rank, result in enumerate(
            keyword_results,
            start=1,
        ):
            chunk_id = result["chunk_id"]

            if chunk_id not in merged:
                merged[chunk_id] = {
                    **result,
                    "rrf_score": 0.0,
                }

            merged[chunk_id]["rrf_score"] += (
                self._rrf_score(rank)
            )

        results = list(merged.values())

        results.sort(
            key=lambda result: result["rrf_score"],
            reverse=True,
        )

        return results

    def search(
        self,
        query: str,
        top_k: int = 5,
        document_id: str | None = None,
    ):

        retrieval_k = max(
            top_k * 2,
            10,
        )

        # -------------------------
        # 1. Semantic search
        # -------------------------

        semantic_results = self._semantic_search(
            query=query,
            top_k=retrieval_k,
            document_id=document_id,
        )

        # -------------------------
        # 2. Keyword search
        # -------------------------

        keyword_chunks = (
            self.chunk_repository.keyword_search(
                query=query,
                top_k=retrieval_k,
                document_id=document_id,
            )
        )

        keyword_results = (
            self._keyword_results_to_dicts(
                keyword_chunks
            )
        )

        # -------------------------
        # 3. RRF fusion
        # -------------------------

        hybrid_results = self._merge_results(
            semantic_results=semantic_results,
            keyword_results=keyword_results,
        )

        if not hybrid_results:
            return []

        # -------------------------
        # 4. CrossEncoder reranking
        # -------------------------

        return self.reranker.rerank(
            query=query,
            results=hybrid_results[:retrieval_k],
            top_k=top_k,
        )