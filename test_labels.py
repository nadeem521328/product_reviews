import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
os.environ["HF_TOKEN"] = "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"
os.environ["HF_HUB_OFFLINE"] = "1"

from transformers import pipeline

# Load the model directly
model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
try:
    analyzer = pipeline("sentiment-analysis", model=model_name, local_files_only=True)
except:
    analyzer = pipeline("sentiment-analysis", model=model_name)

# Test with clearly negative reviews
test_reviews = [
    "This product is terrible",
    "I hate this item",
    "Worst purchase ever",
    "Complete waste of money",
    "Absolutely awful"
]

print("Testing CardiffNLP model labels:")
print("=" * 40)

for review in test_reviews:
    result = analyzer(review)[0]
    print(f"Review: '{review}'")
    print(f"Raw label: '{result['label']}'")
    print(f"Score: {result['score']:.3f}")
    print()