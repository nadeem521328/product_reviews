from sentiment_model import load_sentiment_model
from IndividualSentiment import classify_with_threshold

# Load sentiment analysis model
analyzer = load_sentiment_model()

# Test with some negative reviews
test_reviews = [
    'This product is terrible and I hate it',
    'Worst purchase ever, complete waste of money',
    'Absolutely awful quality, do not buy',
    'I am very disappointed with this item',
    'This is the worst thing I have ever bought',
    'Complete garbage, do not waste your money'
]

print("Testing sentiment model with negative reviews:")
print("=" * 50)

for i, review in enumerate(test_reviews, 1):
    result = analyzer(review)[0]
    sentiment, confidence = classify_with_threshold(result)

    print(f"Review {i}: {review[:50]}...")
    print(f"  Raw result: {result}")
    print(f"  Final classification: {sentiment} (confidence: {confidence:.3f})")
    print()