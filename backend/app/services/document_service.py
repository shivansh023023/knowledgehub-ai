from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.services.file_service import FileService


class DocumentService:
    """Handles document-related business logic."""

    def __init__(self, db: Session):
        self.db = db
        self.file_service = FileService(db)

    def upload_document(self, file: UploadFile):
        return self.file_service.upload_file(file)