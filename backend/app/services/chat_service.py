from collections.abc import Generator

from sqlalchemy.orm import Session

from app.repositories.chunk_repository import ChunkRepository
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.chat_message_repository import ChatMessageRepository
from app.repositories.chat_message_source_repository import (
    ChatMessageSourceRepository,
)
from app.services.rag_service import RAGService


class ChatService:
    """Coordinates chat persistence and RAG."""

    def __init__(self, db: Session):
        self.db = db

        self.conversation_repository = ConversationRepository(db)
        self.message_repository = ChatMessageRepository(db)
        self.source_repository = ChatMessageSourceRepository(db)

        self.rag_service = RAGService(
            ChunkRepository(db)
        )

    def _set_title_if_new(
        self,
        conversation,
        question: str,
    ):
        if conversation.title == "New Chat":
            title = question.strip()

            if len(title) > 50:
                title = title[:50].rstrip() + "..."

            conversation.title = title

    def _get_conversation_and_history(
        self,
        conversation_id: str | None,
    ):
        if conversation_id is None:
            conversation = self.conversation_repository.create()
            history = ""

        else:
            conversation = (
                self.conversation_repository.get_by_id(
                    conversation_id
                )
            )

            if conversation is None:
                raise ValueError("Conversation not found.")

            previous_messages = (
                self.message_repository.list_recent_messages(
                    conversation.id,
                    limit=10,
                )
            )

            history = "\n\n".join(
                f"{message.role.capitalize()}:\n{message.content}"
                for message in previous_messages
            )

        return conversation, history

    def chat(
        self,
        question: str,
        conversation_id: str | None = None,
        document_id: str | None = None,
    ):
        try:
            conversation, history = (
                self._get_conversation_and_history(
                    conversation_id
                )
            )

            self.message_repository.create(
                conversation_id=conversation.id,
                role="user",
                content=question,
            )

            self._set_title_if_new(
                conversation,
                question,
            )

            response = self.rag_service.chat(
                question=question,
                history=history,
                document_id=document_id,
            )

            assistant_message = (
                self.message_repository.create(
                    conversation_id=conversation.id,
                    role="assistant",
                    content=response["answer"],
                )
            )

            self.source_repository.create_many(
                assistant_message.id,
                response["sources"],
            )
            if conversation.title == "New Chat":
                conversation.title = question[:50]

            self.conversation_repository.touch(
                conversation
            )

            self.db.commit()

            return {
                "conversationId": conversation.id,
                "answer": response["answer"],
                "sources": response["sources"],
            }

        except Exception:
            self.db.rollback()
            raise

    def stream_chat(
        self,
        question: str,
        conversation_id: str | None = None,
        document_id: str | None = None,
    ):
        conversation, history = (
            self._get_conversation_and_history(
                conversation_id
            )
        )

        self.message_repository.create(
            conversation_id=conversation.id,
            role="user",
            content=question,
        )

        self._set_title_if_new(
            conversation,
            question,
        )

        stream, sources = self.rag_service.stream_chat(
            question=question,
            history=history,
            document_id=document_id,
        )

        if stream is None:
            self.db.commit()

            return (
                conversation.id,
                None,
                [],
            )

        def generate():
            answer_parts = []

            try:
                for token in stream:
                    answer_parts.append(token)
                    yield token

                answer = "".join(answer_parts)

                assistant_message = (
                    self.message_repository.create(
                        conversation_id=conversation.id,
                        role="assistant",
                        content=answer,
                    )
                )

                self.source_repository.create_many(
                    assistant_message.id,
                    sources,
                )
                if conversation.title == "New Chat":
                    conversation.title = question[:50]

                self.conversation_repository.touch(
                    conversation
                )

                self.db.commit()

            except Exception:
                self.db.rollback()
                raise

        return (
            conversation.id,
            generate(),
            sources,
        )