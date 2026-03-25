import pandas as pd
import requests
import json
import os

# Sample CSV data
sample_data = { 
    "review": [
        "This product is amazing! Great quality and fast delivery.",
        "Terrible experience. Poor customer service and late delivery.",
        "Average product, nothing special but works okay.",
        "Best purchase ever! Highly recommend to everyone.",
        "Not happy with this at all. Broken on arrival."
    ]
}

# Save sample CSV
csv_path = 'sample_reviews.csv'
df = pd.DataFrame(sample_data)
df.to_csv(csv_path, index=False)
print(f"Created sample CSV: {csv_path}")

# Test backend /analyze-csv endpoint
url = 'http://localhost:5000/analyze-csv'
with open(csv_path, 'rb') as f:
    files = {'csv_file': f}
    response = requests.post(url, files=files)

print("\\n=== Backend Test Results ===")
if response.status_code == 200:
    result = response.json()
    print("✅ Backend /analyze-csv SUCCESS")
    print(json.dumps(result, indent=2)[:500] + "..." if len(json.dumps(result)) > 500 else json.dumps(result, indent=2))
else:
    print(f"❌ Backend ERROR: {response.status_code}")
    print(response.text)

os.remove(csv_path)
print("\\nTest complete. Backend ready for frontend integration.")
