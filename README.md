# SentimentScope — Customer Review Sentiment Analyzer

A lightweight sentiment analysis dashboard (Flask + React) that turns raw customer reviews into actionable insights using a Hugging Face transformer model with an offline cache fallback.

## Overview

SentimentScope provides a backend API (Flask) that analyzes one or more review texts, detects aspects, computes per-review and aggregate sentiment, generates short "customers say" feedback, and returns star ratings. A React frontend (in `/frontend`) offers an interactive dashboard and history view.

This repo contains:
- Backend: `app.py`, sentiment model loader, utilities, and small SQLite-backed user/session history.
- Frontend: a Vite + React app in the `frontend/` folder.
- Optional training scripts: `train_model.py` to fine-tune a Hugging Face model.

## Key features

- Single-review and multi-review analysis
- Aspect detection and per-aspect sentiment breakdown
- Star rating calculation and human-friendly feedback generation
- User registration/login (JWT) and simple history storage (SQLite)
- Model can run online (download from HF) or offline from `model_cache`

## Requirements

Install system requirements and create a Python virtual environment. This project was developed with Python 3.10+.

- See `requirements.txt` for Python packages (Flask, transformers, torch, pandas, etc.).
- Node.js & npm/yarn for the frontend.

Example (Windows / PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

For frontend:

```bash
cd frontend
npm install
```

## Environment

Copy `.env.example` to `.env` at repository root and adjust values as needed. Important environment variables:

- `JWT_SECRET_KEY` — change for production (default is a dev-only value)
- `DATABASE_URL` — SQLite path (default `sqlite:///users.db`)
- `SENTIMENT_MODEL_NAME` — HF model id (default `cardiffnlp/twitter-roberta-base-sentiment`)
- `MODEL_CACHE_DIR` — directory for model cache (default `./model_cache`)
- `SENTIMENT_MODEL_OFFLINE` — set to `1` to force local-files-only mode
- `FLASK_DEBUG` — `1` enables debug mode (development only)

The frontend also has `frontend/.env.example` for client-side configuration (API origin, etc.).

## Running the backend (development)

Start the Flask API from the repository root:

```bash
python app.py
```

By default the server listens on `0.0.0.0:5000` or values from `FLASK_HOST`/`PORT` env vars.

If the model fails to load (no internet or missing cache) the app falls back to a simple keyword-based classifier.

## Running the frontend (development)

From the `frontend` folder:

```bash
cd frontend
npm run dev
```

Open the Vite dev URL (usually `http://localhost:5173`) and log in using the app UI. The frontend expects the backend API to be reachable at the origin(s) configured via `CORS_ORIGINS` / frontend env.

## API endpoints (summary)

- `POST /register` — JSON `{ "email": "...", "password": "..." }` → registers a user and returns a JWT.
- `POST /login` — JSON `{ "email": "...", "password": "..." }` → returns a JWT.
- `POST /analyze-review` — JSON `{ "review_text": "..." }` → runs sentiment + aspect analysis and returns structured results.
- `POST /import-amazon-reviews` — JSON `{ "url": "<amazon product url>" }` → extracts review lines for the textbox.
- `POST /analyze-csv` — multipart form file upload `csv_file` with a `reviews.text` column (requires auth).
- `GET /history` — returns the most recent saved analysis (requires JWT auth).

Example curl for quick test (no auth required for analyze):

```bash
curl -X POST http://localhost:5000/analyze-review \
  -H "Content-Type: application/json" \
  -d '{"review_text":"I love this product. Great battery life and screen."}'
```

## Model behavior and training

- Models are loaded in `sentiment_model.py` and cached under `MODEL_CACHE_DIR` (`./model_cache` by default).
- To force offline-only use set `SENTIMENT_MODEL_OFFLINE=1` and ensure model files exist in `MODEL_CACHE_DIR`.
- `train_model.py` shows a simple example of fine-tuning using `transformers` / `datasets` and writes a local `./fine_tuned_sentiment` folder. Running training requires extra packages and a HF token (set `HF_TOKEN`) — see the script header.

## Tests

There are several `test_*.py` files in the repo. If you use `pytest`, install it and run:

```bash
pip install pytest
pytest -q
```

Note: Tests may assume model access or local fixtures; run them in an environment where dependencies are available.

## Troubleshooting

- Model load errors: enable internet or populate `model_cache` and set `SENTIMENT_MODEL_OFFLINE=1`.
- JWT errors in production: set a strong `JWT_SECRET_KEY` and avoid the default dev key.
- CORS issues: add the frontend origin to `CORS_ORIGINS` or set `CORS_ORIGINS="*"` for quick debugging (not for production).

## Contributing

Contributions welcome. Open issues or PRs with clear descriptions. For changes to the model or training, include reproducible steps.

## Acknowledgements

Built using Flask, React (Vite), Hugging Face Transformers and the cardiffnlp sentiment model by default.

---

If you'd like, I can also:
- add examples for deploying with Docker,
- create a short `Makefile` or `scripts/` helpers to run dev servers,
- or add a simple `CONTRIBUTING.md`.