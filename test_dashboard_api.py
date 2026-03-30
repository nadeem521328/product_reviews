import requests
import json

reviews_text = """The device offers an excellent reading experience with smooth performance.
I am very pleased with the clarity of the display and battery life.
It is a reliable device that works perfectly for daily reading.
The device has multiple issues and does not perform as expected.
Battery drains quickly and the system often lags.
Overall, a disappointing product with poor build quality.
The device works fine for basic reading needs.
It performs as expected but nothing stands out.
The overall experience is average with standard features."""

url = 'http://localhost:5000/analyze-review'
data = {'review_text': reviews_text}

response = requests.post(url, json=data)
print("API Response status:", response.status_code)
if response.status_code == 200:
    result = response.json()
    print("\nIndividual Sentiments from Dashboard API:")
    print("="*60)
    for rev in result.get('individual_sentiments', []):
        print(f"Review {rev['review_number']}: {rev['sentiment']} (conf: {rev['confidence']:.2f})")
    print("\nSummary:", result.get('summary', {}))
else:
    print("Error:", response.text)
