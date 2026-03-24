import os
from sentiment_model import load_sentiment_model
from IndividualSentiment import classify_with_threshold

# Load data
with open('reviews.txt', 'r', encoding='utf-8') as f:
    reviews_raw = f.read().strip()

reviews = [line.strip() for line in reviews_raw.split('\n') if line.strip()]

# Manual true labels for original 3 reviews
true_labels = ['positive', 'positive', 'negative']  # R1 pos, R2 pos (minor complaint), R3 neg

print(f"Loaded {len(reviews)} reviews")

# Truncate to labeled
reviews_orig = reviews[:3]
true_labels_orig = true_labels[:3]

# User's 9 task reviews with true labels
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

# Original 3 reviews
reviews_orig = reviews[:3]
true_labels_orig = ['positive', 'positive', 'negative']

# Remove duplicate - use 12 reviews (3 orig + 9 task)
reviews = reviews_orig + task_reviews
true_labels = true_labels_orig + task_true_labels

print(f"Evaluating {len(reviews)} reviews total (3 orig + 9 task)...")

# Load model
print("Loading sentiment model...")
sentiment_analyzer = load_sentiment_model()

# Raw predictions
print("\nRaw predictions:")
preds_raw = []
scores_raw = []
for review in reviews:
    result = sentiment_analyzer(review)[0]
    pred = result['label'].lower()
    score = result['score']
    preds_raw.append(pred)
    scores_raw.append(score)
    print(f"Review: {pred} ({score:.2f})")

# Thresholded
print("\nThresholded (0.75):")
preds_thresh = []
scores_thresh = []
for review in reviews:
    result = sentiment_analyzer(review)[0]
    sentiment, score = classify_with_threshold(result)
    preds_thresh.append(sentiment)
    scores_thresh.append(score)
    print(f"Review: {sentiment} ({score:.2f})")

# Simple metrics
classes = ['negative', 'neutral', 'positive']

def simple_f1(true, pred, cls):
    tp = sum(1 for t, p in zip(true, pred) if t == cls == p)
    fp = sum(1 for t, p in zip(true, pred) if cls == p != t)
    fn = sum(1 for t, p in zip(true, pred) if cls == t != p)
    prec = tp / (tp + fp) if (tp + fp) > 0 else 0
    rec = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * prec * rec / (prec + rec) if (prec + rec) > 0 else 0
    return prec, rec, f1

print("\n=== METRICS Raw (6 reviews) ===")
for cls in classes:
    p, r, f1 = simple_f1(true_labels, preds_raw, cls)
    print(f"{cls}: P={p:.2f} R={r:.2f} F1={f1:.2f}")

print("\n=== METRICS Thresh (6 reviews) ===")
for cls in classes:
    p, r, f1 = simple_f1(true_labels, preds_thresh, cls)
    print(f"{cls}: P={p:.2f} R={r:.2f} F1={f1:.2f}")

raw_acc = sum(p == t for p, t in zip(preds_raw, true_labels)) / len(true_labels)
thresh_acc = sum(p == t for p, t in zip(preds_thresh, true_labels)) / len(true_labels)
print(f"\nAccuracy Raw: {raw_acc:.2f}, Thresh: {thresh_acc:.2f}")

print("\nDetailed (1-3 orig, 4-6 user neutrals):")
for i in range(len(reviews)):
    print(f"R{i+1}: True={true_labels[i]}, Raw={preds_raw[i]}({scores_raw[i]:.2f}), Thresh={preds_thresh[i]}({scores_thresh[i]:.2f})")
print("\nFix verified if R4-6 thresh='neutral'")

