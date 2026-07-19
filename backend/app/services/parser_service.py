from pathlib import Path

import fitz
from docx import Document


class ParserService:
    """Extracts plain text from supported document types."""

    def parse(self, filepath: str) -> str:
        path = Path(filepath)

        suffix = path.suffix.lower()

        if suffix == ".pdf":
            return self._parse_pdf(path)

        if suffix == ".docx":
            return self._parse_docx(path)

        if suffix == ".txt":
            return self._parse_txt(path)

        raise ValueError(f"Unsupported file type: {suffix}")

    def _parse_pdf(self, path: Path) -> str:
        text = []

        with fitz.open(path) as pdf:
            for page in pdf:
                text.append(page.get_text())

        return "\n".join(text)

    def _parse_docx(self, path: Path) -> str:
        document = Document(path)

        return "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

    def _parse_txt(self, path: Path) -> str:
        return path.read_text(encoding="utf-8")