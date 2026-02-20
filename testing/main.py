from templates import ASPECT_KEYWORDS, detect_aspects
from sentiment_model import load_sentiment_model

# Initialize sentiment counter
aspect_sentiment_count = {
    aspect: {"POSITIVE": 0, "NEGATIVE": 0}
    for aspect in ASPECT_KEYWORDS
}

reviews = [
    "The battery life is terrible but performance is fast",
    "Camera quality is excellent and the display looks great",
    "The phone is slow and the battery drains quickly",
    "Amazing performance but poor camera",
    "Screen resolution is good but battery backup is bad"
]

sentiment_analyzer = load_sentiment_model()

for review in reviews:
    aspects = detect_aspects(review)

    if not aspects:
        continue

    sentiment = sentiment_analyzer(review)[0]["label"]

    for aspect in aspects:
        aspect_sentiment_count[aspect][sentiment] += 1

print("\nASPECT SENTIMENT SUMMARY")
print("-------------------------")

for aspect, counts in aspect_sentiment_count.items():
    print(
        f"{aspect.capitalize():12} | "
        f"Positive: {counts['POSITIVE']} | "
        f"Negative: {counts['NEGATIVE']}"
    )
