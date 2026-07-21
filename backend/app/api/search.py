from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.chunk_repository import ChunkRepository
from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_service import SearchService

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.post(
    "",
    response_model=SearchResponse,
)
def semantic_search(
    request: SearchRequest,
    db: Session = Depends(get_db),
):

    chunk_repository = ChunkRepository(db)
    search_service = SearchService(chunk_repository)

    results = search_service.search(
        query=request.query,
        top_k=request.top_k,
    )

    return SearchResponse(results=results)