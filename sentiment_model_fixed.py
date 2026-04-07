import os

from transformers import logging, pipeline

os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN"] = "1"
logging.set_verbosity_error()


def _is_truthy(value, default=False):
    if value is None:
        return default
    return str(value).strip().lower() in ("1", "true", "yes", "on")


CACHE_DIR = os.getenv("MODEL_CACHE_DIR", "./model_cache")
MODEL_NAME = os.getenv("SENTIMENT_MODEL_NAME", "cardiffnlp/twitter-roberta-base-sentiment")
OFFLINE_MODE = _is_truthy(os.getenv("SENTIMENT_MODEL_OFFLINE"), default=False)

if OFFLINE_MODE:
    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["TRANSFORMERS_OFFLINE"] = "1"
    os.environ["HUGGINGFACE_HUB_OFFLINE"] = "1"


def load_sentiment_model():
    """
    Load sentiment model with configurable offline/online behavior.
    """
    mode_text = "offline cache only" if OFFLINE_MODE else "online or cache"
    print(f"Loading sentiment model ({mode_text})")
    try:
        analyzer = pipeline(
            "sentiment-analysis",
            model=MODEL_NAME,
            cache_dir=CACHE_DIR,
            local_files_only=OFFLINE_MODE,
            token=False,
            trust_remote_code=True,
        )
        print("Model loaded successfully")
        return analyzer
    except Exception as e:
        print(f"Sentiment model load failed: {e}")
        print("Using fallback logic for dashboard.")
        return None
