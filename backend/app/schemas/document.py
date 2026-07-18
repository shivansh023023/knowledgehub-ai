from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.document import DocumentStatus


class DocumentResponse(BaseModel):
    id: str
    filename: str
    original_filename: str
    mime_type: str
    file_size: int
    status: DocumentStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UploadResponse(BaseModel):
    message: str
    document: DocumentResponse