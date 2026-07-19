from langchain_text_splitters import RecursiveCharacterTextSplitter


class ChunkService:
    """Splits document text into overlapping chunks."""

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                "",
            ],
        )

    def split(self, text: str) -> list[str]:
        return self.text_splitter.split_text(text)