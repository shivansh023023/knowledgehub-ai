from app.services.grounding_validator import GroundingValidator


validator = GroundingValidator()

context = """
Batch Normalization normalizes activations for each mini-batch.
It computes the batch mean and variance and then applies learned
scale and shift parameters gamma and beta.
"""

supported_answer = """
Batch Normalization normalizes activations for each mini-batch
and applies learned scale and shift parameters.
"""

unsupported_answer = """
Batch Normalization eliminates overfitting and always improves
the final accuracy of a neural network.
"""

print("Supported answer:")
print(
    validator.validate(
        supported_answer,
        context,
    )
)

print()

print("Unsupported answer:")
print(
    validator.validate(
        unsupported_answer,
        context,
    )
)
