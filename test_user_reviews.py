from sentiment_model import load_sentiment_model
analyzer = load_sentiment_model()
user_reviews = [
    "The product delivers solid results in most cases, even if there are occasional inconsistencies.",
    "While not perfect, it manages to provide a satisfying experience overall.",
    "It performs reliably for the most part, though a few aspects could still be refined.",
    "The product is fairly average, with a mix of acceptable features and minor limitations.",
    "It neither excels nor fails, maintaining a consistent but unremarkable performance.",
    "The overall experience is balanced, with some positives and some drawbacks.",
    "Initially it seems functional, but over time the shortcomings become more noticeable.",
    "Although it has some useful features, the execution feels lacking in key areas.",
    "The product tries to meet expectations, but ultimately falls short in delivering quality."
]
print("Testing USER REVIEWS (all predicted neutral):")
print("=" * 70)
for i, review in enumerate(user_reviews, 1):
    result = analyzer(review)[0]
    print(f"Review {i}: {review[:60]}...")
    print(f"  Raw: {result['label']} (score: {result['score']:.3f})")
    print()

