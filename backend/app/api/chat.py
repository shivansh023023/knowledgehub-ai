import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService


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
    chat_service = ChatService(db)

    return chat_service.chat(
        question=request.question,
        conversation_id=request.conversation_id,
    )


@router.post("/stream")
def stream_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    chat_service = ChatService(db)

    (
        stream,
        sources,
        conversation_id,
        empty_answer,
    ) = chat_service.stream_chat(
        question=request.question,
        conversation_id=request.conversation_id,
    )

    if stream is None:

        def empty_stream():
            yield json.dumps(
                {
                    "type": "token",
                    "content": empty_answer,
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
                    "type": "conversation",
                    "conversationId": conversation_id,
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
                "type": "conversation",
                "conversationId": conversation_id,
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