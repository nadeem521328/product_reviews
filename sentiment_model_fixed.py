import os

os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HUGGINGFACE_HUB_OFFLINE"] = "1"

from transformers import pipeline, logging
logging.set_verbosity_error()

CACHE_DIR = "./model_cache"

def load_sentiment_model():
    """
    Load sentiment analysis model from local CACHE only (fixes expired HF token).
    Uses cached Twitter-RoBERTa-base-sentiment model.
    """
    model_name = "cardiffnlp/twitter-roberta-base-sentiment"
    print("✓ Loading cached Twitter-RoBERTa (offline mode - no HF auth needed)")
    try:
        analyzer = pipeline(
            "sentiment-analysis",
            model=model_name,
            cache_dir=CACHE_DIR,
            local_files_only=True,
            trust_remote_code=True
        )
        print("✓ Model loaded successfully from cache")
        return analyzer
    except Exception as e:
        print(f"❌ Cache load failed (expected if incomplete): {e}")
        print("Using fallback logic for dashboard.")
        return None
