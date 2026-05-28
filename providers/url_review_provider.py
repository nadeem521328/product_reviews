"""
Amazon URL review provider.

This module is intentionally separate from Flask, the frontend, and the NLP
pipeline. Its only job is to turn an Amazon product URL into plain review text
lines that the existing analyzer can process later.
"""

from providers.rainforest_provider import fetch_reviews_with_mock_fallback
from url_processor import AmazonURLProcessingError, process_amazon_url


class URLReviewProviderError(Exception):
    """Raised when URL-based review import cannot continue."""


MOCK_REVIEWS = [
    "Battery life is excellent and easily lasts through a full day of use.",
    "Display quality is poor in bright sunlight and colors look slightly washed out.",
    "Performance is very smooth while switching between apps and browsing.",
    "Camera quality could be improved, especially in low light conditions.",
    "The product feels durable and the build quality is better than expected.",
    "Setup was simple, but the included instructions could be clearer.",
    "Charging speed is good and the device stays cool during regular use.",
    "Audio quality is average, but it is acceptable for the price.",
]


def get_mock_reviews():
    """Return fallback reviews when an external API is unavailable."""
    return list(MOCK_REVIEWS)


def get_reviews_for_amazon_url(product_url):
    """
    Process an Amazon URL, try real review retrieval, and fall back gracefully.

    Flow:
    1. URL processing extracts final URL, ASIN, and marketplace domain.
    2. Rainforest type="reviews" is attempted using the ASIN/domain.
    3. If reviews are unavailable, Rainforest product top_reviews are attempted.
    4. If both real sources fail, existing mock reviews are returned.
    """
    try:
        product_info = process_amazon_url(product_url)
    except AmazonURLProcessingError as error:
        raise URLReviewProviderError(str(error))

    provider_result = fetch_reviews_with_mock_fallback(
        product_info["asin"],
        product_info["domain"],
        print_raw=False,
    )
    reviews = provider_result["reviews"]
    source = provider_result["source"]
    message = provider_result["message"]

    if not reviews:
        raise URLReviewProviderError("No reviews were available for this product URL.")

    return {
        "product": product_info,
        "reviews": reviews,
        "source": source,
        "message": message,
    }
