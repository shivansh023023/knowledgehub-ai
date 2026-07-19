from app.services.parser_service import ParserService

parser = ParserService()

filepath = "/home/shivanshsingh/Downloads/w3s2_slides_initialization_normalization.pdf"

text = parser.parse(filepath)

print("=" * 80)
print("FIRST 1000 CHARACTERS")
print("=" * 80)
print(text[:1000])
print("=" * 80)
print(f"\nTotal characters extracted: {len(text)}")