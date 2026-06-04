import os

import requests

API_KEY = os.getenv("RAINFOREST_API_KEY", "").strip()
ASIN = "B0872G2MPV"
DOMAIN = "amazon.in"  # or amazon.in

url = "https://api.rainforestapi.com/request"

params = {
    "api_key": API_KEY,
    "type": "product",
    "amazon_domain": DOMAIN,
    "asin": ASIN,
}

response = requests.get(url, params=params, timeout=20)

print("Status code:", response.status_code)
print("Raw response text:")
print(response.text)
