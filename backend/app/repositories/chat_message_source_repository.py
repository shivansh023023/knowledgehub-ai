from sqlalchemy.orm import Session

from app.models.chat_message_source import (
    ChatMessageSource,
)


class ChatMessageSourceRepository:
    """Handles database operations for message sources."""

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create_many(
        self,
        message_id: str,
        sources: list[dict],
    ) -> None:

        objects = [
            ChatMessageSource(
                message_id=message_id,
                document_id=source["document_id"],
                document_name=source["document_name"],
                chunk_index=source["chunk_index"],
                score=source["score"],
            )
            for source in sources
        ]

        self.db.add_all(objects)