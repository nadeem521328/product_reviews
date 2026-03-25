import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from sentiment_model import load_sentiment_model

# Load sentiment analysis model
analyzer = load_sentiment_model()

# Test with some clearly negative reviews
test_reviews = [
    'This product is terrible and I hate it',
    'Worst purchase ever, complete waste of money',
    'Absolutely awful quality, do not buy',
    'I am very disappointed with this item',
    'This is the worst thing I have ever bought',
    'Complete garbage, do not waste your money',
    'Horrible experience, never buying again',
    'This sucks, total disappointment'
]

print("Testing raw model outputs:")
print("=" * 60)

for i, review in enumerate(test_reviews, 1):
    result = analyzer(review)[0]
    print(f"Review {i}: {review}")
    print(f"  Raw result: {result}")
    print(f"  Label: {result['label']}, Score: {result['score']:.3f}")
    print()