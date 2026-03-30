from sentiment_model import load_sentiment_model

analyzer = load_sentiment_model()

if analyzer:
    reviews = [
        "The device delivers a fantastic reading experience with excellent clarity.",
        "I am very happy with how smooth and responsive the interface is.",
        "The battery life is impressive and lasts for a long time.",
        "The device frequently freezes and becomes difficult to use.",
        "The screen quality is poor and not comfortable for long reading.",
        "It feels like a waste of money due to its inconsistent performance.",
        "The device works adequately for everyday reading.",
        "It is an average product with no special features.",
        "The performance is acceptable but not outstanding."
    ]
    
    expected_sentiments = [
        "Positive", "Positive", "Positive",
        "Negative", "Negative", "Negative",
        "Neutral", "Neutral", "Neutral"
    ]
    
    print("SENTIMENT ANALYSIS FOR 10 USER REVIEWS")
    print("=" * 80)
    print("Expected | Review Preview | Raw Prediction (confidence)")
    print("-" * 80)
    
    for i, (review, expected) in enumerate(zip(reviews, expected_sentiments), 1):
        result = analyzer(review)[0]
        label = result['label']
        score = result['score']
        preview = review[:60] + "..." if len(review) > 60 else review
        print(f"{i:2d}. {expected:9} | {preview:50} | {label} ({score:.3f})")
        print()
    
    print("Test complete. Check predictions match expected sentiments.")
else:
    print("ERROR: Model failed to load. Run `python sentiment_model.py` first to cache model.")
