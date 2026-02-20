# templates.py

ASPECT_KEYWORDS = {
    "battery": ["battery", "charge", "backup", "drain"],
    "camera": ["camera", "photo", "picture", "lens"],
    "performance": ["performance", "speed", "fast", "slow"],
    "display": ["screen", "display", "resolution"]
}

def detect_aspects(review):
    review_lower = review.lower()
    found_aspects = []

    for aspect, keywords in ASPECT_KEYWORDS.items():
        if any(keyword in review_lower for keyword in keywords):
            found_aspects.append(aspect)

    return found_aspects
