from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.document import (
    DocumentListItem,
    UploadResponse,
)
from app.services.document_management_service import DocumentManagementService
from app.services.document_upload_service import DocumentUploadService

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.get(
    "",
    response_model=list[DocumentListItem],
)
def list_documents(
    db: Session = Depends(get_db),
):
    document_service = DocumentManagementService(db)

    return document_service.list_documents()


@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=201,
)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    document_service = DocumentUploadService(db)

    document = document_service.upload_document(file)

    return UploadResponse(
        message="File uploaded successfully.",
        document=document,
    )