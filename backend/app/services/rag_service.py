
from collections.abc import Generator

from app.prompts.rag_prompt import build_rag_prompt
from app.repositories.chunk_repository import ChunkRepository
from app.services.llm_service import LLMService
from app.services.search_service import SearchService


class RAGService:
    """Coordinates retrieval, reranking, and LLM generation."""

    def __init__(
        self,
        chunk_repository: ChunkRepository,
    ):
        self.search_service = SearchService(
            chunk_repository
        )
        self.llm_service = LLMService()

    def _build_retrieval_query(
        self,
        question: str,
        history: str = "",
    ) -> str:
        """
        Build a retrieval query using recent conversation
        context so follow-up questions can retrieve the
        correct document chunks.
        """

        if not history.strip():
            return question

        return f"""
Previous conversation:
{history}

Current question:
{question}
""".strip()

    def _prepare_prompt(
        self,
        question: str,
        history: str = "",
    ) -> tuple[str | None, list]:

        retrieval_query = self._build_retrieval_query(
            question,
            history,
        )

        search_results = self.search_service.search(
            query=retrieval_query,
            top_k=5,
        )

        if not search_results:
            return None, []

        context = "\n\n".join(
            f"""
Document: {result['document_name']}
Chunk: {result['chunk_index']}

{result['content']}
""".strip()
            for result in search_results
        )

        prompt = build_rag_prompt(
            context=context,
            question=question,
            history=history,
        )

        return prompt, search_results

    def _build_sources(
        self,
        search_results: list,
    ) -> list:

        seen = set()
        sources = []

        for result in search_results:
            key = (
                result["document_id"],
                result["chunk_index"],
            )

            if key in seen:
                continue

            seen.add(key)

            sources.append(
                {
                    "document_id": result["document_id"],
                    "document_name": result["document_name"],
                    "chunk_index": result["chunk_index"],
                    "score": result["score"],
                    "rerank_score": result.get(
                        "rerank_score"
                    ),
                }
            )

        return sources

    def chat(
        self,
        question: str,
        history: str = "",
    ):

        prompt, search_results = (
            self._prepare_prompt(
                question,
                history,
            )
        )

        if prompt is None:
            return {
                "answer": (
                    "I couldn't find that information "
                    "in the provided documents."
                ),
                "sources": [],
            }

        answer = self.llm_service.generate(
            prompt
        )

        return {
            "answer": answer,
            "sources": self._build_sources(
                search_results
            ),
        }

    def stream_chat(
        self,
        question: str,
        history: str = "",
    ) -> tuple[
        Generator[str, None, None] | None,
        list,
    ]:

        prompt, search_results = (
            self._prepare_prompt(
                question,
                history,
            )
        )

        if prompt is None:
            return None, []

        return (
            self.llm_service.stream(prompt),
            self._build_sources(search_results),
        )
