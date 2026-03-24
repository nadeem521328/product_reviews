import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from sentiment_model import load_sentiment_model
from IndividualSentiment import classify_with_threshold

model = load_sentiment_model()

task_reviews = [
    "The product performs quite well overall, although there are a few minor issues that could be improved.",
    "I liked the design and usability, but the performance occasionally feels inconsistent.",
    "It delivers good results most of the time, even though it doesn’t always meet expectations.",
    "The product is neither impressive nor disappointing. It works, but nothing really stands out.",
    "It does what it is supposed to do, though the experience feels somewhat underwhelming.",
    "Performance is acceptable, but there is a noticeable lack of refinement in some areas.",
    "At first it seemed promising, but over time several issues started to appear.",
    "The product might work for basic use, but it struggles with more demanding tasks.",
    "While it has a few good aspects, the overall experience ends up being frustrating."
]

task_true_labels = [
    'positive', 'positive', 'positive', 'neutral', 'neutral', 'neutral',
    'negative', 'negative', 'negative'
]

print("Predictions on 9 task reviews (threshold 0.60):\n")
for i, review in enumerate(task_reviews, 1):
    result = model(review)[0]
    sent, conf = classify_with_threshold(result)
    true_label = task_true_labels[i-1]
    match = '✓' if sent == true_label else '✗'
    print(f"R{i} ({true_label}): {sent} ({conf:.3f}) {match}")

print(f"\nMatches: {sum(1 for p,t in zip([classify_with_threshold(model(r)[0])[0] for r in task_reviews], task_true_labels) if p==t)}/9")

