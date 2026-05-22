"""
Amazon URL Processing

This module resolves Amazon product URLs and extracts the useful product
information needed by the rest of the project later.

It is intentionally standalone:
- no Flask routes
- no frontend integration
- no changes to existing review analysis logic
"""

import re
from urllib.parse import urlparse, urlunparse

import requests


class AmazonURLProcessingError(Exception):
    """Raised when an Amazon URL cannot be processed safely."""


SHORT_AMAZON_DOMAINS = {"amzn.in", "a.co"}


def _clean_input_url(url):
    """Validate and lightly normalize the user-provided URL string."""
    if not url or not isinstance(url, str):
        raise AmazonURLProcessingError("Invalid URL: URL must be a non-empty string.")

    cleaned_url = url.strip()

    # Let users paste URLs without typing the scheme.
    if not cleaned_url.startswith(("http://", "https://")):
        cleaned_url = "https://" + cleaned_url

    parsed = urlparse(cleaned_url)
    if not parsed.netloc:
        raise AmazonURLProcessingError("Invalid URL: missing domain.")

    return cleaned_url


def _resolve_redirects(url):
    """Resolve short Amazon URLs and other redirects using requests.get()."""
    try:
        response = requests.get(
            url,
            allow_redirects=True,
            timeout=10,
            headers={
                # A simple browser-like user agent helps avoid some basic blocks.
                "User-Agent": "Mozilla/5.0 URL Processor",
            },
        )
        response.raise_for_status()
        return response.url
    except requests.RequestException as error:
        raise AmazonURLProcessingError(f"Request failed while resolving URL: {error}")


def _get_hostname(url):
    """Return the lowercase hostname without a leading www."""
    parsed = urlparse(url)
    hostname = parsed.hostname

    if not hostname:
        raise AmazonURLProcessingError("Invalid URL: missing domain.")

    hostname = hostname.lower()
    if hostname.startswith("www."):
        hostname = hostname[4:]

    return hostname


def _is_supported_amazon_domain(hostname):
    """Check if the hostname is an Amazon marketplace or known short link."""
    if hostname in SHORT_AMAZON_DOMAINS:
        return True

    # Accept amazon.in, amazon.com, and subdomains such as www.amazon.in.
    # This avoids accepting unrelated domains like amazon.com.example.com.
    return bool(re.fullmatch(r"([a-z0-9-]+\.)*amazon\.[a-z.]+", hostname))


def _extract_marketplace_domain(hostname):
    """Convert hosts such as www.amazon.in or m.amazon.com to amazon.in/com."""
    hostname = hostname.lower()

    if hostname in SHORT_AMAZON_DOMAINS:
        raise AmazonURLProcessingError("Missing marketplace domain after redirect.")

    match = re.search(r"amazon\.[a-z.]+$", hostname)
    if not match:
        raise AmazonURLProcessingError("Non-Amazon URL: marketplace domain not found.")

    return match.group(0)


def _extract_asin(url):
    """Extract ASIN from common Amazon product URL formats."""
    parsed = urlparse(url)
    path = parsed.path

    # Common examples:
    # /dp/B08N5WRWNW
    # /gp/product/B08N5WRWNW
    # /Some-Product-Name/dp/B08N5WRWNW
    patterns = [
        r"/dp/([A-Z0-9]{10})(?:[/?]|$)",
        r"/gp/product/([A-Z0-9]{10})(?:[/?]|$)",
        r"/product/([A-Z0-9]{10})(?:[/?]|$)",
    ]

    for pattern in patterns:
        match = re.search(pattern, path, flags=re.IGNORECASE)
        if match:
            return match.group(1).upper()

    raise AmazonURLProcessingError("Missing ASIN: no Amazon product ID found in URL.")


def _build_normalized_url(domain, asin):
    """Build a clean canonical Amazon product URL."""
    return urlunparse(("https", domain, f"/dp/{asin}", "", "", ""))


def process_amazon_url(url):
    """
    Resolve and extract product information from an Amazon URL.

    Returns:
        dict: {
            "final_url": "https://amazon.in/dp/XXXXXXXXXX",
            "asin": "XXXXXXXXXX",
            "domain": "amazon.in"
        }
    """
    cleaned_url = _clean_input_url(url)
    original_hostname = _get_hostname(cleaned_url)

    if not _is_supported_amazon_domain(original_hostname):
        raise AmazonURLProcessingError("Non-Amazon URL: unsupported domain.")

    resolved_url = _resolve_redirects(cleaned_url)
    final_hostname = _get_hostname(resolved_url)

    if not _is_supported_amazon_domain(final_hostname):
        raise AmazonURLProcessingError("Non-Amazon URL after redirect.")

    domain = _extract_marketplace_domain(final_hostname)
    asin = _extract_asin(resolved_url)
    final_url = _build_normalized_url(domain, asin)

    return {
        "final_url": final_url,
        "asin": asin,
        "domain": domain,
    }


if __name__ == "__main__":
    print("Amazon URL Processor")
    print("--------------------")
    user_url = input("Paste an Amazon product URL: ")

    try:
        result = process_amazon_url(user_url)
        print("\nProcessed result:")
        print(f"Final URL : {result['final_url']}")
        print(f"ASIN      : {result['asin']}")
        print(f"Domain    : {result['domain']}")
    except AmazonURLProcessingError as error:
        print(f"\nError: {error}")
