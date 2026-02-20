"""
Star Rating Calculator
Converts sentiment analysis results to star ratings (1-5)
"""


def calculate_star_rating(sentiment_label, confidence_score):
    """
    Calculate star rating (1-5) based on sentiment label and confidence score.
    
    Args:
        sentiment_label: str - 'positive', 'neutral', or 'negative'
        confidence_score: float - confidence score between 0 and 1
    
    Returns:
        int: Star rating from 1 to 5
    
    Mapping Logic:
    - POSITIVE with high confidence (0.8+) → 5 stars
    - POSITIVE with medium confidence (0.5-0.79) → 4 stars
    - POSITIVE with low confidence (<0.5) → 3 stars
    - NEUTRAL → 3 stars
    - NEGATIVE with low confidence (<0.5) → 2 stars
    - NEGATIVE with high confidence (0.5+) → 1 star
    """
    if sentiment_label == "positive":
        if confidence_score >= 0.8:
            return 5
        elif confidence_score >= 0.5:
            return 4
        else:
            return 3
    elif sentiment_label == "neutral":
        return 3
    elif sentiment_label == "negative":
        if confidence_score < 0.5:
            return 2
        else:
            return 1
    else:
        # Default for unknown sentiment
        return 3


def get_star_display(stars):
    """
    Get star display string (e.g., "⭐⭐⭐⭐☆")
    
    Args:
        stars: int - number of stars (1-5)
    
    Returns:
        str: Star display string
    """
    filled = "⭐" * stars
    empty = "☆" * (5 - stars)
    return filled + empty


def calculate_average_rating(reviews):
    """
    Calculate average star rating from a list of reviews.
    
    Args:
        reviews: list of dicts with 'sentiment' and 'confidence' keys
    
    Returns:
        float: Average star rating
    """
    if not reviews:
        return 0
    
    total_stars = 0
    for review in reviews:
        sentiment = review.get('sentiment', 'neutral')
        confidence = review.get('confidence', 0.5)
        stars = calculate_star_rating(sentiment, confidence)
        total_stars += stars
    
    return round(total_stars / len(reviews), 1)


if __name__ == "__main__":
    # Test the rating calculator
    test_cases = [
        ("positive", 0.95),
        ("positive", 0.72),
        ("positive", 0.45),
        ("neutral", 0.65),
        ("negative", 0.40),
        ("negative", 0.89),
    ]
    
    print("Star Rating Calculator Test")
    print("=" * 50)
    for label, confidence in test_cases:
        stars = calculate_star_rating(label, confidence)
        display = get_star_display(stars)
        print(f"{label:10} (conf: {confidence:.2f}) → {stars} stars {display}")
