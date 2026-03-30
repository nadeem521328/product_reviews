from sentiment_model import load_sentiment_model

analyzer = load_sentiment_model()

if analyzer:
    reviews = [
        "The device offers an excellent reading experience with smooth performance.",
        "I am very pleased with the clarity of the display and battery life.",
        "It is a reliable device that works perfectly for daily reading.",
        "The device has multiple issues and does not perform as expected.",
        "Battery drains quickly and the system often lags.",
        "Overall, a disappointing product with poor build quality.",
        "The device works fine for basic reading needs.",
        "It performs as expected but nothing stands out.",
        "The overall experience is average with standard features."
    ]
    expected_labels = [
        "Positive",
        "Positive", 
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Neutral",
        "Neutral",
        "Neutral"
    ]
    
    print("MODEL PREDICTIONS FOR USER REVIEWS")
    print("=" * 80)
    print("Expected | Review | Raw Prediction (score)")
    print("-" * 80)
    
    for i, (review, expected) in enumerate(zip(reviews, expected_labels), 1):
        result = analyzer(review)[0]
        label = result['label']
        score = result['score']
        print(f"{expected:9} | {review[:60]}... | {label} ({score:.3f})")
        print()
    
    print("Test complete.")
else:
    print("Model failed to load")
