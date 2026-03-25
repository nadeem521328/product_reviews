import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from sentiment_model import load_sentiment_model
from IndividualSentiment import classify_with_threshold

model = load_sentiment_model()

task_reviews = [
    "The product delivers solid results in most cases, even if there are occasional inconsistencies.",
    "While not perfect, it manages to provide a satisfying experience overall.",
    "It performs reliably for the most part, though a few aspects could still be refined.",
    "The product is fairly average, with a mix of acceptable features and minor limitations.",
    "It neither excels nor fails, maintaining a consistent but unremarkable performance.",
    "The overall experience is balanced, with some positives and some drawbacks.",
    "Initially it seems functional, but over time the shortcomings become more noticeable.",
    "Although it has some useful features, the execution feels lacking in key areas.",
    "The product tries to meet expectations, but ultimately falls short in delivering quality.",
    "The product underperforms compared to competitors and fails to justify its price."
]

task_true_labels = [
    'positive', 'positive', 'positive', 'neutral', 'neutral', 'neutral',
    'negative', 'negative', 'negative', 'negative'
]

print("Predictions on 10 task reviews (current threshold 0.60):\\n")
matches = 0
for i, review in enumerate(task_reviews, 1):
    result = model(review)[0]
    sent, conf = classify_with_threshold(result)
    true_label = task_true_labels[i-1]
    match = '✓' if sent == true_label else '✗'
    print(f"R{i} ({true_label}): {sent} ({conf:.3f}) {match}")
    if sent == true_label:
        matches += 1

print(f"\\nMatches: {matches}/10")

print("\\nAfter threshold → 0.70, re-run to verify fix!")
print("Raw predictions shown above use current logic.")

