from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class ChatSource(BaseModel):
    document_id: str
    document_name: str
    chunk_index: int
    score: float


class ChatResponse(BaseModel):
    answer: str
    sources: list[ChatSource]