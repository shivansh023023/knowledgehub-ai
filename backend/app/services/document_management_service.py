from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.chunk_repository import ChunkRepository
from app.repositories.document_repository import DocumentRepository
from app.services.file_service import FileService
from app.vectorstore.qdrant_repository import QdrantRepository


class DocumentManagementService:
    """Handles document management operations."""

    def __init__(self, db: Session):
        self.db = db

        self.document_repository = DocumentRepository(db)
        self.chunk_repository = ChunkRepository(db)
        self.file_service = FileService(db)
        self.qdrant_repository = QdrantRepository()

    def list_documents(self):
        return self.document_repository.list_documents()

    def delete_document(
        self,
        document_id: str,
    ) -> None:

        document = self.document_repository.get_by_id(document_id)

        if document is None:
            raise HTTPException(
                status_code=404,
                detail="Document not found.",
            )

        # -------------------------
        # Delete vectors from Qdrant
        # -------------------------

        self.qdrant_repository.delete_document_vectors(document.id)

        # -------------------------
        # Delete chunks from SQLite
        # -------------------------

        self.chunk_repository.delete_by_document_id(document.id)

        # -------------------------
        # Delete document row
        # -------------------------

        self.document_repository.delete(document)

        self.db.commit()

        # -------------------------
        # Delete file from disk
        # -------------------------

        self.file_service.delete_file(document.filepath)