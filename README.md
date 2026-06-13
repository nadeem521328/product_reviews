# SentimentScope

AI-powered customer review intelligence platform that analyzes product reviews, detects sentiment, extracts product aspects, generates star ratings, and provides actionable customer insights through an interactive analytics dashboard.

## Live Demo

Frontend:
https://sentiment-scope-kappa.vercel.app

Backend API:
https://nadeemshaik-r3-product-review-sentiment.hf.space

## Key Features

* JWT Authentication
* Review Analysis from Text, TXT, CSV, and Amazon URLs
* Transformer-Based Sentiment Analysis
* Aspect-Based Review Intelligence
* Automatic Star Rating Generation
* Interactive Analytics Dashboard
* Analysis History Tracking
* Excel Export Functionality
* Dark/Light Mode Support

## Tech Stack

### Frontend

* React
* Vite
* Material UI
* Recharts

### Backend

* Flask
* SQLAlchemy
* JWT Authentication

### AI / NLP

* Hugging Face Transformers
* PyTorch
* RoBERTa Sentiment Model

### Deployment

* Vercel (Frontend)
* Hugging Face Spaces (Backend)

## Architecture

```text
User
 ↓
React + Vite Frontend
 ↓
Flask REST API
 ↓
RoBERTa Sentiment Model
 ↓
SQLite Database
```

## Run the Project Locally

To run SentimentScope on your machine:

### 1. Clone the Repository

```bash
git clone https://github.com/nadeem521328/product_reviews.git
cd product_reviews
```

### 2. Start the Backend

Create and activate a virtual environment, install the dependencies, and run the Flask server:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will be available at:

```text
http://localhost:5000
```

### 3. Start the Frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

You can now register an account, log in, and start analyzing reviews locally.


## Author

Nadeem Shaik

GitHub: https://github.com/nadeem521328
