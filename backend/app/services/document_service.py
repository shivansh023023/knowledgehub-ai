from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.document import DocumentStatus
from app.repositories.chunk_repository import ChunkRepository
from app.services.chunk_service import ChunkService
from app.services.embedding_service import EmbeddingService
from app.services.file_service import FileService
from app.services.parser_service import ParserService
from app.vectorstore.qdrant_repository import QdrantRepository


class DocumentService:
    """Orchestrates the complete document ingestion pipeline."""

    def __init__(self, db: Session):
        self.db = db

        self.file_service = FileService(db)
        self.parser_service = ParserService()
        self.chunk_service = ChunkService()
        self.chunk_repository = ChunkRepository(db)

        self.embedding_service = EmbeddingService()
        self.qdrant_repository = QdrantRepository()

    def upload_document(self, file: UploadFile):
        print("1. Starting upload")

        document = self.file_service.upload_file(file)
        print("2. File saved")

        try:
            # -------------------------
            # Upload Complete
            # -------------------------

            document.status = DocumentStatus.UPLOADED
            self.db.commit()
            print("3. Status -> UPLOADED")

            # -------------------------
            # Parsing
            # -------------------------

            document.status = DocumentStatus.PARSING
            self.db.commit()
            print("4. Status -> PARSING")

            text = self.parser_service.parse(document.filepath)
            print(f"5. Parsed {len(text)} characters")

            # -------------------------
            # Chunking
            # -------------------------

            document.status = DocumentStatus.CHUNKING
            self.db.commit()
            print("6. Status -> CHUNKING")

            chunks = self.chunk_service.split(text)
            print(f"7. Created {len(chunks)} chunks")

            chunk_objects = self.chunk_repository.save_chunks(
                document_id=document.id,
                chunks=chunks,
            )

            print("8. Chunks saved")

            # -------------------------
            # Embedding
            # -------------------------

            document.status = DocumentStatus.EMBEDDING
            self.db.commit()
            print("9. Status -> EMBEDDING")

            texts = [
                chunk.content
                for chunk in chunk_objects
            ]

            embeddings = self.embedding_service.embed_documents(texts)

            print(f"10. Generated {len(embeddings)} embeddings")

            self.qdrant_repository.insert_embeddings(
                chunks=chunk_objects,
                embeddings=embeddings,
            )

            print("11. Stored vectors in Qdrant")

            # -------------------------
            # Finished
            # -------------------------

            document.status = DocumentStatus.READY
            self.db.commit()
            self.db.refresh(document)

            print("12. DONE")

            return document

        except Exception as e:
            print("ERROR:", repr(e))

            document.status = DocumentStatus.FAILED
            self.db.commit()

            raise