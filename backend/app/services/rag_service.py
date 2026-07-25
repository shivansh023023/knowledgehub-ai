from app.prompts.rag_prompt import build_rag_prompt
from app.services.llm_service import LLMService
from app.services.search_service import SearchService
from app.repositories.chunk_repository import ChunkRepository


class RAGService:
    """Coordinates retrieval and LLM generation."""

    def __init__(
        self,
        chunk_repository: ChunkRepository,
    ):
        self.search_service = SearchService(chunk_repository)
        self.llm_service = LLMService()

    def chat(
        self,
        question: str,
    ):
        # Retrieve relevant chunks
        search_results = self.search_service.search(question)

        # No relevant documents found
        if not search_results:
            return {
                "answer": "I couldn't find any relevant information in the uploaded documents.",
                "sources": [],
            }

        # Build context
        context = "\n\n".join(
            result["content"]
            for result in search_results
        )

        # Build prompt
        prompt = build_rag_prompt(
            context=context,
            question=question,
        )

        # Generate answer
        answer = self.llm_service.generate(prompt)

        # Build sources
        sources = [
            {
                "document_id": result["document_id"],
                "document_name": result["document_name"],
                "chunk_index": result["chunk_index"],
                "score": result["score"],
            }
            for result in search_results
        ]

        return {
            "answer": answer,
            "sources": sources,
        }