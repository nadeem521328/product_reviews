"""
Script to download the sentiment model locally to avoid network issues.
Run this script before running app.py to ensure the model is cached locally.
"""
import os

# Set environment variables
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
os.environ["HF_TOKEN"] = "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"

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

def download_model():
    model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    cache_dir = "./model_cache"
    
    print(f"Downloading model: {model_name}")
    print(f"Cache directory: {cache_dir}")
    
    # Create cache directory
    os.makedirs(cache_dir, exist_ok=True)
    
    # Download tokenizer
    print("Downloading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        cache_dir=cache_dir
    )
    print("Tokenizer downloaded successfully!")
    
    # Download model
    print("Downloading model...")
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name,
        cache_dir=cache_dir
    )
    print("Model downloaded successfully!")
    
    print(f"\nModel saved to: {os.path.abspath(cache_dir)}")
    print("You can now run app.py!")

if __name__ == "__main__":
    download_model()
