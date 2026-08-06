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

    def __init__(
        self,
        db: Session,
    ):
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

    def chat(
        self,
        question: str,
        conversation_id: str | None = None,
    ):
        try:

            # ----------------------------
            # Create or load conversation
            # ----------------------------

            if conversation_id is None:

                conversation = (
                    self.conversation_repository.create()
                )

                history = ""

            else:

                conversation = (
                    self.conversation_repository.get_by_id(
                        conversation_id
                    )
                )

                if conversation is None:
                    raise ValueError(
                        "Conversation not found."
                    )

                # ----------------------------
                # Load recent history
                # ----------------------------

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

            # ----------------------------
            # Save user message
            # ----------------------------

            self.message_repository.create(
                conversation_id=conversation.id,
                role="user",
                content=question,
            )

            # ----------------------------
            # Generate answer
            # ----------------------------

            response = self.rag_service.chat(
                question=question,
                history=history,
            )

            # ----------------------------
            # Save assistant message
            # ----------------------------

            assistant_message = (
                self.message_repository.create(
                    conversation_id=conversation.id,
                    role="assistant",
                    content=response["answer"],
                )
            )

            # ----------------------------
            # Save sources
            # ----------------------------

            self.source_repository.create_many(
                assistant_message.id,
                response["sources"],
            )

            # ----------------------------
            # Update conversation timestamp
            # ----------------------------

            self.conversation_repository.touch(
                conversation
            )

            # ----------------------------
            # Commit transaction
            # ----------------------------

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
        """
        Streaming persistence will be added later.
        """

        return self.rag_service.stream_chat(
            question,
            history="",
        )