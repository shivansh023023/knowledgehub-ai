from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentRepository:
    """Handles database operations for documents."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(
        self,
        document_id: str,
    ) -> Document | None:

        stmt = (
            select(Document)
            .where(Document.id == document_id)
        )

        return self.db.scalar(stmt)

    def get_documents_by_ids(
        self,
        document_ids: list[str],
    ) -> list[Document]:

        stmt = (
            select(Document)
            .where(Document.id.in_(document_ids))
        )

        return list(
            self.db.scalars(stmt).all()
        )