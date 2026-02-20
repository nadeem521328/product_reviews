# import os
# os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

# from transformers import pipeline, logging
# logging.set_verbosity_error()

# # Load model
# sentiment_analyzer = pipeline(
#     "sentiment-analysis",
#     model="distilbert-base-uncased-finetuned-sst-2-english"
# )

# reviews = []
# current_review = ""

# # Read and merge related lines
# with open("reviews.txt", "r", encoding="utf-8") as file:
#     for line in file:
#         line = line.strip()

#         if not line:
#             continue

#         # If line starts a new review title
#         if line.lower().startswith("review"):
#             if current_review:
#                 reviews.append(current_review.strip())
#                 current_review = ""
#             current_review += line + " "
#         else:
#             current_review += line + " "

# # Add last review
# if current_review:
#     reviews.append(current_review.strip())

# # Sentiment analysis
# positive = 0
# negative = 0

# print("\nSentiment Analysis Results:\n")

# for i, review in enumerate(reviews, start=1):
#     result = sentiment_analyzer(review)[0]

#     print(f"Review {i}:")
#     print(review)
#     print(f"Sentiment: {result['label']}, Confidence: {result['score']:.2f}\n")

#     if result["label"] == "POSITIVE":
#         positive += 1
#     else:
#         negative += 1

# print("SUMMARY")
# print("-------")
# print(f"Total Reviews : {len(reviews)}")
# print(f"Positive      : {positive}")
# print(f"Negative      : {negative}")














































































































# # import os
# # os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

# # from transformers import pipeline, logging
# # logging.set_verbosity_error()

# # # Load sentiment model
# # sentiment_analyzer = pipeline(
# #     "sentiment-analysis",
# #     model="distilbert-base-uncased-finetuned-sst-2-english"
# # )

# # # Read reviews from TXT file
# # with open("reviews.txt", "r", encoding="utf-8") as file:
# #     reviews = [line.strip() for line in file if line.strip()]

# # positive = 0
# # negative = 0

# # print("\nSentiment Analysis Results:\n")

# # for i, review in enumerate(reviews, start=1):
# #     result = sentiment_analyzer(review)[0]

# #     print(f"Review {i}: {review}")
# #     print(f"Sentiment: {result['label']}, Confidence: {result['score']:.2f}\n")

# #     if result["label"] == "POSITIVE":
# #         positive += 1
# #     else:
# #         negative += 1

# # print("SUMMARY")
# # print("-------")
# # print(f"Total Reviews : {len(reviews)}")
# # print(f"Positive      : {positive}")
# # print(f"Negative      : {negative}")
