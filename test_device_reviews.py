from sentiment_model_fixed import load_sentiment_model
def map_label(label):
    if label == 'LABEL_0' or 'negative' in label.lower():
        return 'negative'
    elif label == 'LABEL_1' or 'neutral' in label.lower():
        return 'neutral'
    elif label == 'LABEL_2' or 'positive' in label.lower():
        return 'positive'
    return label.lower()

analyzer = load_sentiment_model()

if analyzer:
    reviews = [
        "The device provides a very enjoyable reading experience with great performance.",
        "I love how lightweight and easy it is to use for long hours.",
        "The display is sharp and makes reading very comfortable.",
        "The device crashes often and becomes unusable at times.",
        "The battery does not last long and requires frequent charging.",
        "The overall quality is poor and disappointing.",
        "It works fine for reading but has no standout features.",
        "The device is decent and performs basic functions well.",
        "The experience is average and depends on usage."
    ]
    
    print("SENTIMENT PREDICTIONS FOR 10 DEVICE REVIEWS")
    print("=" * 80)
    print("Review Preview                  | Raw Label | Score  | Sentiment")
    print("-" * 80)
    
    for i, review in enumerate(reviews, 1):
        result = analyzer(review)[0]
        raw_label = result['label']
        score = result['score']
        sentiment = map_label(raw_label)
        preview = review[:35] + '...' if len(review) > 35 else review
        print(f"{i:2d}: {preview:<35} | {raw_label:<9} | {score:.3f} | {sentiment}")
    
    print("\nPredictions complete using cached Twitter-RoBERTa model.")
else:
    print("ERROR: Model failed to load. Run `python sentiment_model_fixed.py` first to ensure cache is ready.")
