import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.chunk_repository import ChunkRepository
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_service import RAGService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


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

    return rag_service.chat(
        question=request.question,
    )


@router.post("/stream")
def stream_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    chunk_repository = ChunkRepository(db)

    rag_service = RAGService(chunk_repository)

    stream, sources = rag_service.stream_chat(
        question=request.question,
    )

    if stream is None:

        def empty_stream():
            yield json.dumps(
                {
                    "type": "answer",
                    "content": (
                        "I couldn't find any relevant "
                        "information in the uploaded documents."
                    ),
                }
            ) + "\n"

            yield json.dumps(
                {
                    "type": "sources",
                    "sources": [],
                }
            ) + "\n"

            yield json.dumps(
                {
                    "type": "done",
                }
            ) + "\n"

        return StreamingResponse(
            empty_stream(),
            media_type="application/x-ndjson",
        )

    def generate():
        for token in stream:
            yield json.dumps(
                {
                    "type": "token",
                    "content": token,
                }
            ) + "\n"

        yield json.dumps(
            {
                "type": "sources",
                "sources": sources,
            }
        ) + "\n"

        yield json.dumps(
            {
                "type": "done",
            }
        ) + "\n"

    return StreamingResponse(
        generate(),
        media_type="application/x-ndjson",
    )