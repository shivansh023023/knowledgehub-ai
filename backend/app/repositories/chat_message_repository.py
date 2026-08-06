from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage


class ChatMessageRepository:
    """Handles database operations for chat messages."""

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        conversation_id: str,
        role: str,
        content: str,
    ) -> ChatMessage:

        message = ChatMessage(
            conversation_id=conversation_id,
            role=role,
            content=content,
        )

        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)

        return message

    def list_by_conversation(
        self,
        conversation_id: str,
    ) -> list[ChatMessage]:

        stmt = (
            select(ChatMessage)
            .where(
                ChatMessage.conversation_id
                == conversation_id
            )
            .order_by(
                ChatMessage.created_at
            )
        )

        return list(
            self.db.scalars(stmt).all()
        )