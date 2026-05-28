"""
Standalone Rainforest API test.

Run from the project root:
    python test_rainforest.py

This test does not touch Flask, the frontend, URL import, or the NLP pipeline.
It only verifies:
    ASIN + Amazon domain -> Rainforest API -> normalized review text list
"""

import os

from providers.rainforest_provider import (
    RainforestProviderError,
    fetch_reviews,
    fetch_reviews_with_mock_fallback,
)


def _ask_for_value(label, default=""):
    """Read a terminal value and allow a simple default."""
    suffix = f" [{default}]" if default else ""
    value = input(f"{label}{suffix}: ").strip()
    return value or default


if __name__ == "__main__":
    print("Rainforest Review Fetch Test")
    print("----------------------------")
    print("This standalone test prints status code and raw response text first.")
    print("Then it prints only the normalized review text lines.\n")

    asin = _ask_for_value("Enter ASIN")
    domain = _ask_for_value("Enter Amazon domain", "amazon.in")

    # Prefer environment variable for local safety:
    # PowerShell example:
    #   $env:RAINFOREST_API_KEY="your_key_here"
    api_key = _ask_for_value(
        "Enter Rainforest API key",
        os.getenv("RAINFOREST_API_KEY", "").strip(),
    )

    try:
        reviews = fetch_reviews(asin, domain, api_key=api_key, print_raw=True)
        source = "rainforest"
    except RainforestProviderError as error:
        print(f"\nRainforest API failed: {error}")
        print("Trying product top_reviews, then mock fallback if needed.\n")
        fallback = fetch_reviews_with_mock_fallback(
            asin,
            domain,
            api_key=api_key,
            print_raw=False,
        )
        reviews = fallback["reviews"]
        source = fallback["source"]

    print("\nExtracted review texts")
    print("----------------------")
    print(f"Source: {source}")
    print(f"Count : {len(reviews)}\n")

    for index, review in enumerate(reviews, start=1):
        print(f"{index}. {review}")
