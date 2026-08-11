from sqlalchemy.orm import Session

from app.repositories.chunk_repository import ChunkRepository
from app.repositories.conversation_repository import (
    ConversationRepository,
)
from app.repositories.chat_message_repository import (
    ChatMessageRepository,
)
from app.repositories.chat_message_source_repository import (
    ChatMessageSourceRepository,
)
from app.services.rag_service import RAGService


class ChatService:
    """Coordinates chat persistence and RAG."""

    def __init__(self, db: Session):
        self.db = db

        self.conversation_repository = (
            ConversationRepository(db)
        )

        self.message_repository = (
            ChatMessageRepository(db)
        )

        self.source_repository = (
            ChatMessageSourceRepository(db)
        )

        self.rag_service = RAGService(
            ChunkRepository(db)
        )

    def _get_or_create_conversation(
        self,
        conversation_id: str | None,
    ):
        if conversation_id is None:
            return self.conversation_repository.create()

        conversation = (
            self.conversation_repository.get_by_id(
                conversation_id
            )
        )

        if conversation is None:
            raise ValueError(
                "Conversation not found."
            )

        return conversation

    def _get_history(
        self,
        conversation_id: str,
    ) -> str:
        previous_messages = (
            self.message_repository.list_recent_messages(
                conversation_id,
                limit=10,
            )
        )

        return "\n\n".join(
            f"{message.role.capitalize()}:\n"
            f"{message.content}"
            for message in previous_messages
        )

    def chat(
        self,
        question: str,
        conversation_id: str | None = None,
    ):
        try:
            conversation = (
                self._get_or_create_conversation(
                    conversation_id
                )
            )

            history = self._get_history(
                conversation.id
            )

            # Save user message
            self.message_repository.create(
                conversation_id=conversation.id,
                role="user",
                content=question,
            )

            # Generate answer
            response = self.rag_service.chat(
                question=question,
                history=history,
            )

            # Save assistant message
            assistant_message = (
                self.message_repository.create(
                    conversation_id=conversation.id,
                    role="assistant",
                    content=response["answer"],
                )
            )

            # Save sources
            self.source_repository.create_many(
                assistant_message.id,
                response["sources"],
            )

            # Update conversation
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
    ):
        try:
            conversation = (
                self._get_or_create_conversation(
                    conversation_id
                )
            )

            history = self._get_history(
                conversation.id
            )

            # Save user message immediately
            self.message_repository.create(
                conversation_id=conversation.id,
                role="user",
                content=question,
            )

            stream, sources = (
                self.rag_service.stream_chat(
                    question=question,
                    history=history,
                )
            )

            if stream is None:
                assistant_text = (
                    "I couldn't find any relevant "
                    "information in the uploaded "
                    "documents."
                )

                assistant_message = (
                    self.message_repository.create(
                        conversation_id=conversation.id,
                        role="assistant",
                        content=assistant_text,
                    )
                )

                self.source_repository.create_many(
                    assistant_message.id,
                    [],
                )

                self.conversation_repository.touch(
                    conversation
                )

                self.db.commit()

                return (
                    None,
                    [],
                    conversation.id,
                    assistant_text,
                )

            def generate():
                assistant_text = ""

                try:
                    for token in stream:
                        assistant_text += token
                        yield token

                    # Save complete assistant response
                    assistant_message = (
                        self.message_repository.create(
                            conversation_id=conversation.id,
                            role="assistant",
                            content=assistant_text,
                        )
                    )

                    # Save sources
                    self.source_repository.create_many(
                        assistant_message.id,
                        sources,
                    )

                    # Update conversation
                    self.conversation_repository.touch(
                        conversation
                    )

                    self.db.commit()

                except Exception:
                    self.db.rollback()
                    raise

            return (
                generate(),
                sources,
                conversation.id,
                None,
            )

        except Exception:
            self.db.rollback()
            raise