import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from transformers import pipeline, logging
logging.set_verbosity_error()

sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

reviews = []

count = int(input("How many reviews do you want to enter? "))

for i in range(count):
    review = input(f"Enter review {i+1}: ")
    reviews.append(review)

positive = 0
negative = 0

print("\nSentiment Analysis Results:\n")

for review in reviews:
    result = sentiment_analyzer(review)[0]
    print(f"Review: {review}")
    print(f"Sentiment: {result['label']}, Confidence: {result['score']:.2f}\n")

    if result["label"] == "POSITIVE":
        positive += 1
    else:
        negative += 1

print("SUMMARY")
print("-------")
print(f"Total Reviews : {len(reviews)}")
print(f"Positive      : {positive}")
print(f"Negative      : {negative}")
