# SentimentScope

A full-stack customer review intelligence platform built with **React, Flask, Python, NLP, and Hugging Face Transformers**.

The application helps users analyze customer reviews, identify sentiment trends, detect product aspects, generate star ratings, and visualize insights through an interactive dashboard.

## Overview

SentimentScope transforms raw customer reviews into actionable insights.

Users can analyze reviews from manual text input, TXT files, CSV datasets, or Amazon product review imports. The platform uses a transformer-based sentiment model and presents results through dashboards, charts, aspect analysis, and exportable history.

## Key Features

### Customer Features

* User registration and login with JWT authentication
* Review analysis from text, TXT, CSV, and Amazon URLs
* Sentiment classification (Positive, Neutral, Negative)
* Aspect-based sentiment analysis
* Automatic star rating generation
* Interactive dashboard with charts and summaries
* Analysis history tracking
* Excel export support
* Light and dark mode

## Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | React, Vite, Material UI           |
| Backend        | Flask, Python                      |
| Database       | SQLite, SQLAlchemy                 |
| Authentication | JWT                                |
| NLP            | Hugging Face Transformers, PyTorch |
| Charts         | Recharts                           |
| Deployment     | Vercel + Flask Hosting             |

## Architecture

```text
React Frontend
      ↓
Flask REST API
      ↓
Sentiment Analysis Engine
      ↓
SQLite Database
      ↓
Dashboard & Analytics
```

## Security Highlights

* JWT-based authentication
* Password hashing with Werkzeug
* Protected routes and APIs
* Configurable CORS policies
* Environment variable based configuration

## Project Highlights

* Built a complete full-stack review analytics platform.
* Integrated Hugging Face transformer models into a Flask API.
* Designed multiple review ingestion methods including Amazon review imports.
* Implemented aspect-based sentiment analysis and rating generation.
* Created dashboard visualizations for sentiment insights and trends.
* Developed exportable analysis history for user reporting.

## Setup

### Backend

```bash
pip install -r requirements.txt
python app.py
```

`requirements.txt` is configured to install `torch==2.11.0` from the official PyTorch CPU wheel index. This avoids the large NVIDIA/CUDA dependencies that are not needed by this app.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Render Deployment

Use these settings for the Flask backend on Render:

```bash
# Build Command
pip install torch==2.11.0 --index-url https://download.pytorch.org/whl/cpu && pip install -r requirements.txt
```

```bash
# Start Command
gunicorn app:app
```

Required environment variables:

```env
JWT_SECRET_KEY=your_strong_secret_here
DATABASE_URL=sqlite:///users.db
CORS_ORIGINS=https://your-frontend-domain.com
SENTIMENT_MODEL_NAME=cardiffnlp/twitter-roberta-base-sentiment
MODEL_CACHE_DIR=./model_cache
SENTIMENT_MODEL_OFFLINE=0
```

The app does not use CUDA or GPU-specific PyTorch APIs, so CPU-only PyTorch is compatible with the current sentiment pipeline.

## Future Enhancements

* PostgreSQL support
* Automated testing
* Background inference processing
* Advanced NLP models
* Real-time analytics

## Author

Nadeem Shaik

GitHub: https://github.com/nadeem521328
