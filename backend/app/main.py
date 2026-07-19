from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.documents import router as documents_router
from app.core.config import settings
from app.core.startup import initialize_qdrant


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_qdrant()
    yield


app = FastAPI(
    title="KnowledgeHub AI API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    documents_router,
    prefix="/api",
)


@app.get("/")
def home():
    return {
        "status": "success",
        "message": "KnowledgeHub AI Backend is running successfully!",
    }