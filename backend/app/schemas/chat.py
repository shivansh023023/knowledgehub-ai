from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    conversation_id: str | None = Field(
        default=None,
        alias="conversationId",
    )

    document_id: str | None = Field(
        default=None,
        alias="documentId",
    )

    question: str

    model_config = ConfigDict(
        populate_by_name=True,
    )


class ChatSource(BaseModel):
    document_id: str
    document_name: str
    chunk_index: int
    score: float
    rerank_score: float | None = None


class ChatResponse(BaseModel):
    conversation_id: str | None = Field(
        default=None,
        alias="conversationId",
    )

    answer: str

    sources: list[ChatSource]

    model_config = ConfigDict(
        populate_by_name=True,
    )