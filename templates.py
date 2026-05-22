# templates.py

ASPECT_KEYWORDS = {
    "battery": ["battery", "charge", "backup", "drain"],
    "camera": ["camera", "photo", "picture", "lens"],
    "performance": ["performance", "speed", "fast", "slow"],
    "display": ["screen", "display", "resolution"],
    "price_value": ["price", "cost", "costly", "expensive", "worth", "budget", "value", "overpriced", "affordable"],
    "build_quality": ["build", "durable", "durability", "material", "plastic", "premium", "sturdy", "solid", "fragile", "hinge", "hinges"],
    "audio": ["audio", "sound", "speaker", "speakers", "volume", "mic", "microphone", "voice", "clarity"],
    "heat_thermal": ["heat", "heating", "thermal", "temperature", "hot", "overheat", "overheating", "fan noise", "fan"],
    "service_support": ["service", "support", "warranty", "replacement", "customer care", "engineer visit", "repair", "refunded", "refund"],
    "delivery_packaging": ["delivery", "packaging", "package", "packed", "box", "sealed", "timely delivery", "damaged", "broken on arrival"]
}

def detect_aspects(review):
    review_lower = review.lower()
    found_aspects = []

    for aspect, keywords in ASPECT_KEYWORDS.items():
        if any(keyword in review_lower for keyword in keywords):
            found_aspects.append(aspect)

    return found_aspects
