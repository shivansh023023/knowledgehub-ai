from collections.abc import Generator

from app.prompts.rag_prompt import build_rag_prompt
from app.repositories.chunk_repository import ChunkRepository
from app.services.grounding_validator import GroundingValidator
from app.services.llm_service import LLMService
from app.services.query_rewrite_service import QueryRewriteService
from app.services.search_service import SearchService


class RAGService:
    """Coordinates retrieval, reranking, grounding, and LLM generation."""

    def __init__(
        self,
        chunk_repository: ChunkRepository,
    ):
        self.search_service = SearchService(
            chunk_repository
        )

        self.llm_service = LLMService()

        self.grounding_validator = GroundingValidator()

        self.query_rewrite_service = (
            QueryRewriteService()
        )

    def _prepare_prompt(
        self,
        question: str,
        history: str = "",
        document_id: str | None = None,
    ) -> tuple[str | None, list, str]:

        # Rewrite follow-up questions into
        # standalone search queries.
        search_query = (
            self.query_rewrite_service.rewrite(
                question=question,
                history=history,
            )
        )

        print(
            f"Original question: {question}"
        )

        print(
            f"Retrieval query: {search_query}"
        )

        # Search using the rewritten query.
        search_results = self.search_service.search(
            query=search_query,
            top_k=5,
            document_id=document_id,
        )

        if not search_results:
            return None, [], ""

        context = "\n\n".join(
            f"""
Document: {result['document_name']}
Chunk: {result['chunk_index']}

{result['content']}
""".strip()
            for result in search_results
        )

        # The LLM receives the original question,
        # not the rewritten search query.
        prompt = build_rag_prompt(
            context=context,
            question=question,
            history=history,
        )

        return prompt, search_results, context

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
                    "document_name": result[
                        "document_name"
                    ],
                    "chunk_index": result[
                        "chunk_index"
                    ],
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
        document_id: str | None = None,
    ):

        prompt, search_results, context = (
            self._prepare_prompt(
                question,
                history,
                document_id,
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

        print("\n" + "=" * 70)
        print("GROUNDING VALIDATION")
        print("=" * 70)
        print("ANSWER:")
        print(answer)
        print("-" * 70)
        print("CONTEXT:")
        print(context)
        print("-" * 70)

        is_grounded = (
            self.grounding_validator.validate(
                answer=answer,
                context=context,
            )
        )

        print(
            f"GROUNDING RESULT: {is_grounded}"
        )
        print("=" * 70)

        if not is_grounded:
            answer = (
                "I couldn't find that information "
                "in the provided documents."
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
        document_id: str | None = None,
    ) -> tuple[
        Generator[str, None, None] | None,
        list,
    ]:

        prompt, search_results, context = (
            self._prepare_prompt(
                question,
                history,
                document_id,
            )
        )

        if prompt is None:
            return None, []

        raw_stream = self.llm_service.stream(
            prompt
        )

        def validated_stream():
            answer_parts = []

            # Collect the complete generated answer.
            for token in raw_stream:
                answer_parts.append(token)

            answer = "".join(answer_parts)

            # Debug information for grounding validation.
            print("\n" + "=" * 70)
            print("GROUNDING VALIDATION")
            print("=" * 70)
            print("ANSWER:")
            print(answer)
            print("-" * 70)
            print("CONTEXT:")
            print(context)
            print("-" * 70)

            # Validate the complete answer against
            # the retrieved context.
            is_grounded = (
                self.grounding_validator.validate(
                    answer=answer,
                    context=context,
                )
            )

            print(
                f"GROUNDING RESULT: {is_grounded}"
            )
            print("=" * 70)

            if not is_grounded:
                answer = (
                    "I couldn't find that information "
                    "in the provided documents."
                )

            yield answer

        return (
            validated_stream(),
            self._build_sources(
                search_results
            ),
        )