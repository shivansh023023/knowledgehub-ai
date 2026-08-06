import uuid

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ChatMessageSource(Base):
    __tablename__ = "chat_message_sources"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    message_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey(
            "chat_messages.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    document_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
    )

    document_name: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    chunk_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    message: Mapped["ChatMessage"] = relationship(
        back_populates="sources",
    )