import os
import numpy as np
from sentiment_model import load_sentiment_model
from IndividualSentiment import classify_with_threshold
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, f1_score
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Load data
with open('reviews.txt', 'r', encoding='utf-8') as f:
    reviews_raw = f.read().strip()

reviews = [line.strip() for line in reviews_raw.split('\n') if line.strip()]

# Manual true labels for the 3 reviews (expand this list for better eval)
# R1: positive (good battery/camera)
# R2: positive (telephoto good, minor slow app)
# R3: negative (battery degradation)
true_labels = ['positive', 'positive', 'negative']

print(f"Loaded {len(reviews)} reviews")

if len(reviews) != len(true_labels):
    print("Warning: Number of reviews != labels. Truncating to min length.")
    min_len = min(len(reviews), len(true_labels))
    reviews = reviews[:min_len]
    true_labels = true_labels[:min_len]

# Load model
print("Loading sentiment model...")
sentiment_analyzer = load_sentiment_model()

# Predict raw
print("Predicting raw...")
preds_raw = []
scores_raw = []
for review in reviews:
    result = sentiment_analyzer(review)[0]
    preds_raw.append(result['label'].lower())
    scores_raw.append(result['score'])

# Predict thresholded
print("Predicting thresholded...")
preds_thresh = []
scores_thresh = []
for i, review in enumerate(reviews):
    result = sentiment_analyzer(review)[0]
    sentiment, score = classify_with_threshold(result)
    preds_thresh.append(sentiment)
    scores_thresh.append(score)

# Encode labels for metrics
le = LabelEncoder()
true_encoded = le.fit_transform(true_labels)
raw_encoded = le.transform(preds_raw)
thresh_encoded = le.transform(preds_thresh)

# Metrics
print("\n=== CLASSIFICATION REPORT (Raw Model) ===")
print(classification_report(true_labels, preds_raw, target_names=le.classes_))

print("\n=== CLASSIFICATION REPORT (Thresholded) ===")
print(classification_report(true_labels, preds_thresh, target_names=le.classes_))

print(f"\nMacro F1 Raw: {f1_score(true_encoded, raw_encoded, average='macro'):.3f}")
print(f"Macro F1 Thresh: {f1_score(true_encoded, thresh_encoded, average='macro'):.3f}")

# Confusion matrices
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Raw CM
cm_raw = confusion_matrix(true_encoded, raw_encoded)
sns.heatmap(cm_raw, annot=True, fmt='d', cmap='Blues', xticklabels=le.classes_, yticklabels=le.classes_, ax=axes[0])
axes[0].set_title('Confusion Matrix - Raw Model')

# Thresh CM
cm_thresh = confusion_matrix(true_encoded, thresh_encoded)
sns.heatmap(cm_thresh, annot=True, fmt='d', cmap='Blues', xticklabels=le.classes_, yticklabels=le.classes_, ax=axes[1])
axes[1].set_title('Confusion Matrix - Thresholded (0.55)')

plt.tight_layout()
plt.savefig('sentiment_eval.png')
plt.show()

print("\nEval complete. Check sentiment_eval.png for CM plots.")
print("Note: Only 3 labeled examples. Add more manual labels to true_labels list for better eval.")
print("To add synthetic data or HF dataset, extend the script.")

