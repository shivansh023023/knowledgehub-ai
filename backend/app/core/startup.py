
from qdrant_client.http.models import (
    Distance,
    VectorParams,
)

from app.core.config import settings
from app.db.database import engine
from app.db.base import Base

# Import all models so SQLAlchemy knows about them
from app.models import *  # noqa: F401,F403

from app.vectorstore.qdrant_client import client


def initialize_database() -> None:
    Base.metadata.create_all(bind=engine)
    print("✓ SQLite database initialized.")


def initialize_qdrant() -> None:
    collections = client.get_collections().collections

    collection_names = {
        collection.name
        for collection in collections
    }

    if settings.QDRANT_COLLECTION in collection_names:
        print(
            f"✓ Qdrant collection '{settings.QDRANT_COLLECTION}' already exists."
        )
        return

    client.create_collection(
        collection_name=settings.QDRANT_COLLECTION,
        vectors_config=VectorParams(
            size=settings.EMBEDDING_DIMENSION,
            distance=Distance.COSINE,
        ),
    )

    print(
        f"✓ Created Qdrant collection '{settings.QDRANT_COLLECTION}'."
    )