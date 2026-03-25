import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from sentiment_model import load_sentiment_model

# Load sentiment analysis model
sentiment_analyzer = load_sentiment_model()


def classify_with_threshold(result, threshold=0.70):
    """
    Map model labels to standard sentiment labels.
    Handles different model formats:
    - CardiffNLP: LABEL_0=negative, LABEL_1=neutral, LABEL_2=positive or Negative/Neutral/Positive
    - NLPTown: 1 star=negative, 2 star=negative, 3 star=neutral, 4 star=positive, 5 star=positive
    """
    label = result['label']
    score = result['score']

    # Handle NLPTown model (star ratings)
    if 'star' in label:
        stars = int(label.split()[0])  # Extract number from "1 star", "2 stars", etc.
        if stars <= 2:
            sentiment = 'negative'
        elif stars == 3:
            sentiment = 'neutral'
        else:  # 4-5 stars
            sentiment = 'positive'
    # Handle CardiffNLP model
    elif label == 'LABEL_0' or label == 'Negative' or label.lower() == 'negative':
        sentiment = 'negative'
    elif label == 'LABEL_1' or label == 'Neutral' or label.lower() == 'neutral':
        sentiment = 'neutral'
    elif label == 'LABEL_2' or label == 'Positive' or label.lower() == 'positive':
        sentiment = 'positive'
    else:
        # Fallback
        sentiment = label.lower()

    return sentiment, score


def analyze_individual_sentiments(review_text):
    # Each new line = one review
    reviews = [line.strip() for line in review_text.split('\n') if line.strip()]

    positive = 0
    neutral = 0
    negative = 0

    individual_results = []

    for i, review in enumerate(reviews, start=1):
        # Truncate very long reviews to 512 tokens (~2000 chars) to avoid token limit
        # Sentiment models typically have 512 token limit
        review_to_analyze = review[:2000] if len(review) > 2000 else review
        result = sentiment_analyzer(review_to_analyze)[0]
        sentiment, confidence = classify_with_threshold(result)

        individual_results.append({
            'review_number': i,
            'text': review,
            'sentiment': sentiment,
            'confidence': round(confidence, 2)
        })

        if sentiment == "positive":
            positive += 1
        elif sentiment == "neutral":
            neutral += 1
        else:
            negative += 1

    summary = {
        'total_reviews': len(reviews),
        'positive': positive,
        'neutral': neutral,
        'negative': negative
    }

    return individual_results, summary


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python IndividualSentiment.py \"<review_text>\"")
        sys.exit(1)

    review_text = sys.argv[1]

    individual_results, summary = analyze_individual_sentiments(review_text)

    print("\\nSentiment Analysis Results Individually:\\n")

    for result in individual_results:
        print(f"Review {result['review_number']}: {result['text']}")
        print(f"Sentiment: {result['sentiment']}, Confidence: {result['confidence']:.2f}\\n")

    print("SUMMARY")
    print("-------")
    print(f"Total Reviews : {summary['total_reviews']}")
    print(f"Positive      : {summary['positive']}")
    print(f"Neutral       : {summary['neutral']}")
    print(f"Negative      : {summary['negative']}")

