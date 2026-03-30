import os

os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
# Removed expired HF_TOKEN and offline mode - models now cached in ~/.cache/huggingface
# Can set HF_HUB_OFFLINE=1 after first run for true offline

from transformers import pipeline, logging
logging.set_verbosity_error()

# Local cache directory
CACHE_DIR = "./model_cache"


def load_sentiment_model():
    """
    Load sentiment analysis model from local cache or use offline mode.
    Using Twitter-RoBERTa-base-sentiment (optimized for reviews).
    """
    model_name = "cardiffnlp/twitter-roberta-base-sentiment"
    print("✓ Using Twitter-RoBERTa-base-sentiment (optimized for reviews)")
    cache_dir = "./model_cache"
    try:
        print(f"Loading sentiment model: {model_name}")
        return pipeline(
            "sentiment-analysis",
            model=model_name,
            cache_dir=cache_dir,
            trust_remote_code=False
        )
    except Exception as e:
        print(f"Failed to load sentiment model: {e}")
        print("Using full fallback logic.")
        return None
