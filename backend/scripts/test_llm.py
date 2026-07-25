from app.services.llm_service import LLMService

llm = LLMService()

response = llm.generate(
    "Explain Xavier initialization in two sentences."
)

print(response)