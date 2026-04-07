import re


OPTIONAL_NOISE_PATTERNS = (
    r'^Click to play video$',
    r'^Customer image(?:s)?$',
    r'^Read more$',
    r'^(?:One\s+person|[\d,]+\s+people?)\s+found\s+this\s+helpful\.?$',
    r'^Helpful$',
)
OPTIONAL_NOISE_RE = re.compile("|".join(OPTIONAL_NOISE_PATTERNS), re.IGNORECASE)
MANDATORY_NOISE_PATTERNS = (
    r'^Verified Purchase$',
    r'^Report(?: abuse)?$',
    r'^\d+(?:\.\d+)?\s+out of 5 stars.*$',
    r'^Reviewed in .* on .*$',
    r'^(?:Flavour(?: Name)?|Flavor(?: Name)?|Colour|Color|Size|Style Name|Pattern Name|Pack of|Material Type)\s*:.*$',
)
MANDATORY_NOISE_RE = re.compile("|".join(MANDATORY_NOISE_PATTERNS), re.IGNORECASE)
VERIFIED_PURCHASE_RE = re.compile(r'Verified Purchase', re.IGNORECASE)


def _is_noise_line(line):
    return bool(OPTIONAL_NOISE_RE.fullmatch(line) or MANDATORY_NOISE_RE.fullmatch(line))


def _append_review(collected_lines, reviews):
    if not collected_lines:
        return

    text = "\n".join(collected_lines)
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(
        r'\b(?:One\s+person|[\d,]+\s+people?)\s+found\s+this\s+helpful\.?',
        '',
        text,
        flags=re.IGNORECASE,
    )
    text = text.strip()
    if text:
        reviews.append(text)


def extract_review_texts(raw):
    # Extract each review body from "Verified Purchase" up to "Report".
    lines = [line.strip() for line in raw.splitlines()]
    reviews = []
    collecting = False
    collected_lines = []

    for line in lines:
        if not line:
            if collecting and collected_lines and collected_lines[-1] != "":
                collected_lines.append("")
            continue

        if not collecting:
            marker_match = VERIFIED_PURCHASE_RE.search(line)
            if marker_match:
                collecting = True
                # Handle "Colour: BlackVerified Purchase" style lines and keep
                # any actual content that might appear after the marker.
                tail = line[marker_match.end():].strip(" :-")
                if tail and not _is_noise_line(tail):
                    collected_lines.append(tail)
            continue

        if re.fullmatch(r'Report(?: abuse)?', line, re.IGNORECASE):
            _append_review(collected_lines, reviews)
            collecting = False
            collected_lines = []
            continue

        if _is_noise_line(line):
            continue

        collected_lines.append(line)

    # Best-effort capture if the last review is missing trailing "Report".
    if collecting and collected_lines:
        _append_review(collected_lines, reviews)

    return reviews


if __name__ == "__main__":
    raw_data = """
Priyaansh Deepak
5.0 out of 5 stars Brand is brand! Always prefer brand!
Reviewed in India on 11 May 2024
Colour: BlackVerified Purchase
Click to play video
As a first-time laptop user, the Dell 15 has exceeded my expectations.
Read more
Customer image
144 people found this helpful
Helpful
Report
"""

    extracted = extract_review_texts(raw_data)
    for i, review in enumerate(extracted, 1):
        print(f"Review {i}:")
        print(review)
