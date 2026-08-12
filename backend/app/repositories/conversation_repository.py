from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.conversation import Conversation


class ConversationRepository:
    """Handles database operations for conversations."""

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create(
        self,
        title: str = "New Chat",
    ) -> Conversation:

        conversation = Conversation(
            title=title,
        )

        self.db.add(conversation)
        self.db.flush()
        self.db.refresh(conversation)

        return conversation

    def get_by_id(
        self,
        conversation_id: str,
    ) -> Conversation | None:

        stmt = (
            select(Conversation)
            .where(
                Conversation.id == conversation_id
            )
        )

        return self.db.scalar(stmt)

    def list_conversations(
        self,
    ) -> list[Conversation]:

        stmt = (
            select(Conversation)
            .order_by(
                Conversation.last_message_at.desc()
            )
        )

        return list(
            self.db.scalars(stmt).all()
        )

    def update_title(
        self,
        conversation: Conversation,
        title: str,
    ) -> None:

        conversation.title = title

    def touch(
        self,
        conversation: Conversation,
    ) -> None:

        now = datetime.utcnow()

        conversation.updated_at = now
        conversation.last_message_at = now

    def delete(
        self,
        conversation: Conversation,
    ) -> None:

        self.db.delete(conversation)