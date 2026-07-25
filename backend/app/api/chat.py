from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.chunk_repository import ChunkRepository
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_service import RAGService

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post(
    "",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    chunk_repository = ChunkRepository(db)

    rag_service = RAGService(chunk_repository)

    response = rag_service.chat(
        question=request.question,
    )

    return response