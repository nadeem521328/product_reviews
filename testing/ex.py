import os

# Disable Hugging Face progress bars
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from transformers import pipeline, logging

# Disable transformers logging
logging.set_verbosity_error()

# Load sentiment analysis model
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

# Take review input from user
review = input("Enter your review: ")

# Analyze sentiment
result = sentiment_analyzer(review)[0]

# Print clean output
print("\nSentiment Result")
print("----------------")
print(f"Label : {result['label']}")
print(f"Score : {result['score']:.4f}")






































































































# import os
# # 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
# # 🔴 Disable Hugging Face progress bars (THIS IS THE KEY)
# os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
# os.environ["HF_TOKEN"] = "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"


# from transformers import pipeline, logging

# # Disable transformers logging
# logging.set_verbosity_error()

# sentiment_analyzer = pipeline(
#     "sentiment-analysis",
#     model="distilbert-base-uncased-finetuned-sst-2-english"
# )

# review = "phone is great but battery life is extremely poor"
# print(sentiment_analyzer(review))
