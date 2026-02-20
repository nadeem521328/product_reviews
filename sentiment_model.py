import os

os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
os.environ["HF_TOKEN"] = "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"
# Enable offline mode to use cached models
os.environ["HF_HUB_OFFLINE"] = "1"

from transformers import pipeline, logging
logging.set_verbosity_error()

# Local cache directory
CACHE_DIR = "./model_cache"


def load_sentiment_model():
    """
    Load sentiment analysis model from local cache or use offline mode.
    """
    model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    
    # First, try to load from local cache (offline mode)
    try:
        print(f"Loading model from local cache: {CACHE_DIR}")
        return pipeline(
            "sentiment-analysis",
            model=model_name,
            local_files_only=True
        )
    except Exception as cache_error:
        print(f"Cannot load from cache: {cache_error}")
    
    # If cache fails, try without local_files_only (might work if network is available)
    try:
        print("Trying to load model (online mode)...")
        return pipeline(
            "sentiment-analysis",
            model=model_name
        )
    except Exception as online_error:
        print(f"Online load failed: {online_error}")
        
    # If both fail, raise a helpful error
    raise Exception(
        "Failed to load sentiment model.\n"
        "Options to fix:\n"
        "1. Check your internet connection\n"
        "2. Run 'python download_model.py' to download the model\n"
        "3. Make sure you can access https://huggingface.co"
    )
