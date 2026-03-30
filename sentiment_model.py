import os

os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
# Removed expired HF_TOKEN and offline mode - models now cached in ~/.cache/huggingface
# Can set HF_HUB_OFFLINE=1 after first run for true offline

from transformers import pipeline, logging
logging.set_verbosity_error()

# Local cache directory
CACHE_DIR = "./model_cache"
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"


def load_sentiment_model():
    """
    Load sentiment analysis model from CACHE (offline only - fixes expired HF token).
    """
    # Robust public model - no auth issues
    model_name = "cardiffnlp/twitter-roberta-base-sentiment"
    print("✓ Loading cached Twitter-RoBERTa (offline mode - no HF auth needed)")
    cache_dir = CACHE_DIR
    try:
        print("✓ Loading cached Twitter-RoBERTa (offline mode)")
        return pipeline(
            "sentiment-analysis",
            model=model_name,
            cache_dir=cache_dir,
            local_files_only=True
        )
    except Exception as e:
        print(f"Failed to load sentiment model: {e}")
        print("Using fallback logic.")
        return None

