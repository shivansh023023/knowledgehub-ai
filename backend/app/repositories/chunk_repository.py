import tiktoken

from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk


class ChunkRepository:
    def __init__(self, db: Session):
        self.db = db
        self.encoding = tiktoken.get_encoding("cl100k_base")

    def save_chunks(self, document_id: str, chunks: list[str]):
        chunk_objects = []

        for index, content in enumerate(chunks):
            chunk = DocumentChunk(
                document_id=document_id,
                chunk_index=index,
                content=content,
                token_count=len(self.encoding.encode(content)),
            )
            chunk_objects.append(chunk)

        self.db.add_all(chunk_objects)
        self.db.commit()

        return chunk_objects