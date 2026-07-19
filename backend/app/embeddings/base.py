from abc import ABC, abstractmethod


class BaseEmbeddingModel(ABC):
    """Abstract interface for embedding providers."""

    @abstractmethod
    def embed(self, texts: list[str]) -> list[list[float]]:
        pass