import os
import sys

sys.path.append(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

from app.core.config import settings
from app.vectorstore.qdrant_client import client
from qdrant_client.models import Distance, VectorParams


def main():
    if client.collection_exists(settings.QDRANT_COLLECTION):
        client.delete_collection(
            collection_name=settings.QDRANT_COLLECTION
        )
        print("✅ Collection deleted.")

    client.create_collection(
        collection_name=settings.QDRANT_COLLECTION,
        vectors_config=VectorParams(
            size=settings.EMBEDDING_DIMENSION,
            distance=Distance.COSINE,
        ),
    )

    print("✅ Collection recreated.")


if __name__ == "__main__":
    main()