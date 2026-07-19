from app.services.parser_service import ParserService
from app.services.chunk_service import ChunkService

parser = ParserService()
chunker = ChunkService()

filepath = "/home/shivanshsingh/Downloads/w3s2_slides_initialization_normalization.pdf"

text = parser.parse(filepath)

chunks = chunker.split(text)

print(f"Total characters: {len(text)}")
print(f"Total chunks: {len(chunks)}")

print("\nFirst chunk:\n")
print(chunks[0])

print("\nSecond chunk:\n")
print(chunks[1])