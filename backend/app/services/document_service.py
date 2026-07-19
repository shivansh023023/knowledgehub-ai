from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.document import DocumentStatus
from app.services.file_service import FileService
from app.services.parser_service import ParserService


class DocumentService:
    """Handles document-related business logic."""

    def __init__(self, db: Session):
        self.db = db
        self.file_service = FileService(db)
        self.parser_service = ParserService()

    def upload_document(self, file: UploadFile):
        document = self.file_service.upload_file(file)

        try:
            document.status = DocumentStatus.UPLOADED
            self.db.commit()

            document.status = DocumentStatus.PARSING
            self.db.commit()

            extracted_text = self.parser_service.parse(document.filepath)

            document.status = DocumentStatus.READY
            self.db.commit()
            self.db.refresh(document)

            return document

        except Exception:
            document.status = DocumentStatus.FAILED
            self.db.commit()
            raise