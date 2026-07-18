import shutil
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document, DocumentStatus


class FileService:
    @staticmethod
    def upload_document(
        db: Session,
        file: UploadFile,
    ) -> Document:

        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="Filename is missing.",
            )

        allowed_types = {
            mime.strip()
            for mime in settings.ALLOWED_FILE_TYPES.split(",")
        }

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.content_type}",
            )

        today = datetime.now(UTC)

        upload_dir = (
            Path(settings.UPLOAD_DIR)
            / str(today.year)
            / f"{today.month:02d}"
        )

        upload_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        extension = Path(file.filename).suffix.lower()

        filename = f"{uuid4()}{extension}"

        filepath = upload_dir / filename

        with filepath.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = filepath.stat().st_size

        if file_size > settings.MAX_UPLOAD_SIZE:
            filepath.unlink(missing_ok=True)

            raise HTTPException(
                status_code=400,
                detail="File exceeds maximum upload size.",
            )

        document = Document(
            filename=filename,
            original_filename=file.filename,
            filepath=str(filepath),
            mime_type=file.content_type,
            file_size=file_size,
            status=DocumentStatus.UPLOADING,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return document