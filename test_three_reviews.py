import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from sentiment_model import load_sentiment_model
from IndividualSentiment import classify_with_threshold

model = load_sentiment_model()

reviews = [
    "The product is fairly standard and performs as expected, without any notable strengths or weaknesses.",
    "It works adequately for routine tasks, although it doesn't offer anything beyond the basics.",
    "The experience is average overall, with both minor positives and minor drawbacks."
]

print("Raw model predictions:")
for i, review in enumerate(reviews, 1):
    result = model(review)[0]
    print(f"Review {i}: label='{result['label']}', score={result['score']:.3f}")

print("\nCurrent thresholded (0.55):")
for i, review in enumerate(reviews, 1):
    result = model(review)[0]
    sent, conf = classify_with_threshold(result)
    print(f"Review {i}: {sent} ({conf:.3f})")

print("\nRun: python test_three_reviews.py to diagnose")

