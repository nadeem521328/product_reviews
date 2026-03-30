import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from sentiment_model import load_sentiment_model

# Global cache for sentiment analyzer (singleton)
_sentiment_analyzer = None

def get_sentiment_analyzer():
    global _sentiment_analyzer
    if _sentiment_analyzer is None:
        try:
            _sentiment_analyzer = load_sentiment_model()
            print("Sentiment model loaded successfully.")
        except Exception as e:
            print(f"Warning: Failed to load sentiment model: {e}")
            print("Sentiment analysis will use fallback logic.")
            _sentiment_analyzer = None
    return _sentiment_analyzer

