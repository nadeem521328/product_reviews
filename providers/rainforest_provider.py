"""
Rainforest API review provider.

This module is isolated from Flask, the frontend, and the NLP pipeline.
Its only responsibility is:

ASIN + Amazon domain -> Rainforest API -> normalized review text list

The normalized list can later be passed to the existing textbox/import flow
without changing sentiment analysis, aspect detection, or summarization logic.
"""

import os

import requests


RAINFOREST_ENDPOINT = "https://api.rainforestapi.com/request"

# Temporary testing fallback. For real local use, prefer setting:
# RAINFOREST_API_KEY=your_key_here
API_KEY = os.getenv("RAINFOREST_API_KEY", "").strip()


class RainforestProviderError(Exception):
    """Raised when Rainforest review retrieval cannot produce usable reviews."""


def _clean_text(value):
    """Normalize a single review text value into a readable plain string."""
    if value is None:
        return ""

    text = str(value).strip()

    # Keep normalization simple and separate from NLP logic.
    # The analyzer already knows how to process plain review lines.
    text = " ".join(text.split())
    return text


def _get_api_key(api_key=None):
    """
    Read the API key at call time.

    Flask loads .env after imports in this project, so reading os.getenv() only
    once at module import time can miss keys from .env. This helper keeps the
    provider safe for both terminal tests and app usage.
    """
    return _clean_text(api_key or os.getenv("RAINFOREST_API_KEY", "") or API_KEY)


def _extract_text_from_review_item(item):
    """
    Extract review body text from one Rainforest review object.

    Rainforest review payloads commonly expose review text as "body", but this
    helper accepts a few related keys so the provider remains stable if the API
    response shape changes slightly.
    """
    if isinstance(item, str):
        return _clean_text(item)

    if not isinstance(item, dict):
        return ""

    text = (
        item.get("body")
        or item.get("review")
        or item.get("review_text")
        or item.get("review_body")
        or item.get("text")
        or item.get("content")
        or ""
    )
    return _clean_text(text)


def normalize_reviews(payload):
    """
    Convert a Rainforest JSON response into a clean list of review text strings.

    Desired output:
        [
            "Battery life is excellent",
            "Display quality is poor",
        ]
    """
    if not isinstance(payload, dict):
        raise RainforestProviderError("Invalid response: expected a JSON object.")

    # Rainforest commonly returns reviews under "reviews".
    raw_reviews = payload.get("reviews") or []

    if not isinstance(raw_reviews, list):
        raise RainforestProviderError("Invalid response: reviews field is not a list.")

    reviews = []
    seen = set()

    for item in raw_reviews:
        text = _extract_text_from_review_item(item)
        if not text:
            continue

        # Avoid duplicate review lines if an API response repeats items.
        dedupe_key = text.lower()
        if dedupe_key in seen:
            continue

        seen.add(dedupe_key)
        reviews.append(text)

    if not reviews:
        raise RainforestProviderError("Rainforest returned no usable review text.")

    return reviews


def normalize_product_top_reviews(payload):
    """
    Extract review body text from a Rainforest type="product" response.

    Rainforest's type="reviews" endpoint can be temporarily unavailable, but
    type="product" may still include real review text under:

        product -> top_reviews -> body
    """
    if not isinstance(payload, dict):
        raise RainforestProviderError("Invalid response: expected a JSON object.")

    product = payload.get("product") or {}
    if not isinstance(product, dict):
        raise RainforestProviderError("Invalid response: product field is not an object.")

    raw_reviews = product.get("top_reviews") or []
    if not isinstance(raw_reviews, list):
        raise RainforestProviderError("Invalid response: top_reviews field is not a list.")

    reviews = []
    seen = set()

    for item in raw_reviews:
        text = _extract_text_from_review_item(item)
        if not text:
            continue

        dedupe_key = text.lower()
        if dedupe_key in seen:
            continue

        seen.add(dedupe_key)
        reviews.append(text)

    if not reviews:
        raise RainforestProviderError("Rainforest product response returned no usable top reviews.")

    return reviews


def _raise_for_api_status(response):
    """Convert HTTP status codes into beginner-friendly API errors."""
    if response.status_code == 429:
        raise RainforestProviderError("Rainforest API rate limit reached.")

    if 500 <= response.status_code <= 599:
        raise RainforestProviderError("Rainforest API is currently unavailable.")

    if response.status_code >= 400:
        raise RainforestProviderError(
            f"Rainforest API request failed with status {response.status_code}."
        )


def _request_rainforest(request_type, asin, domain, api_key=None, print_raw=True):
    """Send one Rainforest API request and return parsed JSON."""
    asin = _clean_text(asin).upper()
    domain = _clean_text(domain).lower()
    api_key = _get_api_key(api_key)

    if not api_key:
        raise RainforestProviderError("Missing Rainforest API key.")
    if not asin:
        raise RainforestProviderError("Missing ASIN.")
    if not domain:
        raise RainforestProviderError("Missing Amazon domain.")

    params = {
        "api_key": api_key,
        "type": request_type,
        "amazon_domain": domain,
        "asin": asin,
    }

    try:
        response = requests.get(RAINFOREST_ENDPOINT, params=params, timeout=20)
    except requests.RequestException as error:
        raise RainforestProviderError(f"Rainforest API request failed: {error}")

    # Required for standalone testing/debugging before deep parsing.
    if print_raw:
        print(f"Request type: {request_type}")
        print(f"Status code: {response.status_code}")
        print("Raw response text:")
        print(response.text)

    _raise_for_api_status(response)

    try:
        payload = response.json()
    except ValueError as error:
        raise RainforestProviderError(f"Invalid JSON response from Rainforest: {error}")

    # Some APIs return a 200 status with an error object in JSON.
    if isinstance(payload, dict) and payload.get("error"):
        raise RainforestProviderError(f"Rainforest API error: {payload.get('error')}")

    request_info = payload.get("request_info") if isinstance(payload, dict) else None
    if isinstance(request_info, dict) and request_info.get("success") is False:
        message = request_info.get("message") or "Rainforest API reported an unsuccessful request."
        raise RainforestProviderError(f"Rainforest API error: {message}")

    return payload


def fetch_reviews(asin, domain, api_key=None, print_raw=True):
    """
    Fetch and normalize Amazon reviews from Rainforest API.

    Request flow:
    1. Build Rainforest query params using API key, domain, and ASIN.
    2. Send a GET request with requests.get().
    3. Print status code and raw response text before JSON parsing.
    4. Validate JSON and extract only normalized review body text.
    """
    payload = _request_rainforest("reviews", asin, domain, api_key=api_key, print_raw=print_raw)
    return normalize_reviews(payload)


def fetch_product_top_reviews(asin, domain, api_key=None, print_raw=True):
    """
    Fetch real review text from Rainforest type="product" top_reviews.

    This is useful when type="reviews" is unavailable but product details still
    include top review bodies.
    """
    payload = _request_rainforest("product", asin, domain, api_key=api_key, print_raw=print_raw)
    return normalize_product_top_reviews(payload)


def fetch_reviews_safely(asin, domain, api_key=None, print_raw=True):
    """
    Gracefully fetch Rainforest reviews.

    This mirrors the requested fallback shape:

        try:
            rainforest_reviews = fetch_reviews(...)
        except:
            rainforest_reviews = []
    """
    try:
        return fetch_reviews(asin, domain, api_key=api_key, print_raw=print_raw)
    except RainforestProviderError as error:
        print(f"Rainforest fetch failed: {error}")
        return []


def fetch_reviews_with_mock_fallback(asin, domain, api_key=None, print_raw=True):
    """
    Fetch real reviews, then fall back safely if needed.

    Fallback chain:
    1. Rainforest type="reviews"
    2. Rainforest type="product" -> product["top_reviews"]
    3. Existing mock reviews
    """
    rainforest_reviews = fetch_reviews_safely(
        asin,
        domain,
        api_key=api_key,
        print_raw=print_raw,
    )

    if rainforest_reviews:
        return {
            "source": "rainforest_reviews",
            "reviews": rainforest_reviews,
            "message": "Reviews imported from Rainforest API.",
        }

    product_top_reviews = []
    try:
        product_top_reviews = fetch_product_top_reviews(
            asin,
            domain,
            api_key=api_key,
            print_raw=print_raw,
        )
    except RainforestProviderError as error:
        print(f"Rainforest product top_reviews fetch failed: {error}")

    if product_top_reviews:
        return {
            "source": "rainforest_product_top_reviews",
            "reviews": product_top_reviews,
            "message": "Reviews imported from Rainforest product top_reviews.",
        }

    # Local import avoids making url_review_provider depend on this module.
    from providers.url_review_provider import get_mock_reviews

    return {
        "source": "mock",
        "reviews": get_mock_reviews(),
        "message": "Using fallback mock reviews because Rainforest returned no reviews.",
    }
