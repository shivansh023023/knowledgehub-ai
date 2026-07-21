from sqlalchemy.orm import Session

from app.repositories.document_repository import DocumentRepository


class DocumentManagementService:
    """Handles document management operations."""

    def __init__(self, db: Session):
        self.document_repository = DocumentRepository(db)

    def list_documents(self):
        return self.document_repository.list_documents()