import requests
import json

# Load reviews
with open('reviews.txt', 'r', encoding='utf-8') as f:
    review_text = f.read()

data = {'review_text': review_text}

# Test endpoint
url = 'http://localhost:5000/analyze-review'
response = requests.post(url, json=data)

if response.status_code == 200:
    result = response.json()
    print("SUCCESS - App test results:")
    print(json.dumps(result, indent=2))
    summary = result.get('summary', {})
    print(f"\nSummary - Positive: {summary.get('positive',0)}, Neutral: {summary.get('neutral',0)}, Negative: {summary.get('negative',0)}")
    print(f"Overall sentiment: {result.get('overall_sentiment', {})}")
    print("Thresholded logic now used consistently!")
else:
    print(f"Error: {response.status_code} - {response.text}")
    print("Start server first: python app.py")

