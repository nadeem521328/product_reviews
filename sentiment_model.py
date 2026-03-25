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
    Using NLPTown model for better product review analysis.
    """
    model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
    
    # Force online load for now to get the new model
    try:
        print(f"Loading NLPTown sentiment model: {model_name}")
        return pipeline(
            "sentiment-analysis",
            model=model_name
        )
    except Exception as e:
        print(f"Failed to load NLPTown model: {e}")
        print("Falling back to CardiffNLP model...")
        
        try:
            return pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest"
            )
        except Exception as e2:
            raise Exception(f"Failed to load any sentiment model: {e2}")
    
    raise Exception("Failed to load sentiment model")
