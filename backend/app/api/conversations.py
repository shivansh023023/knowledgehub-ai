from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.chat_message_repository import ChatMessageRepository


router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post("")
def create_conversation(
    db: Session = Depends(get_db),
):
    repository = ConversationRepository(db)

    conversation = repository.create(
        title="New Chat"
    )

    db.commit()
    db.refresh(conversation)

    return {
        "id": conversation.id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "last_message_at": conversation.last_message_at,
    }


@router.get("")
def list_conversations(
    db: Session = Depends(get_db),
):
    repository = ConversationRepository(db)

    conversations = repository.list_conversations()

    return [
        {
            "id": conversation.id,
            "title": conversation.title,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
            "last_message_at": conversation.last_message_at,
        }
        for conversation in conversations
    ]


@router.get("/{conversation_id}")
def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
):
    conversation_repository = ConversationRepository(db)
    message_repository = ChatMessageRepository(db)

    conversation = conversation_repository.get_by_id(
        conversation_id
    )

    if conversation is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    messages = message_repository.list_by_conversation(
        conversation_id
    )

    return {
        "id": conversation.id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "last_message_at": conversation.last_message_at,
        "messages": [
            {
                "id": message.id,
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at,
            }
            for message in messages
        ],
    }


@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
):
    repository = ConversationRepository(db)

    conversation = repository.get_by_id(
        conversation_id
    )

    if conversation is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    repository.delete(conversation)
    db.commit()

    return {
        "message": "Conversation deleted successfully."
    }