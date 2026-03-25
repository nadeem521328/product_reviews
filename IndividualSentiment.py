import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from sentiment_model import load_sentiment_model

# Load sentiment analysis model
sentiment_analyzer = load_sentiment_model()


def classify_with_threshold(result, threshold=0.70):
    """
    Classify low-confidence predictions as neutral to fix model bias against neutral labels.
    """
    if result['score'] < threshold:
        return 'neutral', result['score']
    return result['label'], result['score']


def analyze_individual_sentiments(review_text):
    # Each new line = one review
    reviews = [line.strip() for line in review_text.split('\n') if line.strip()]

    positive = 0
    neutral = 0
    negative = 0

    individual_results = []

    for i, review in enumerate(reviews, start=1):
        # Skip very long reviews to avoid token limit
        if len(review) > 500:
            continue
        result = sentiment_analyzer(review)[0]
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

