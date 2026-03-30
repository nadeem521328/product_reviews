import sys
import os

# Fix for Unicode encoding issues on Windows
if os.name == 'nt':  # Windows
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from datetime import timedelta
from templates import detect_aspects
from model_loader import get_sentiment_analyzer
from feedback_generator import generate_customers_say
from rating import calculate_star_rating, get_star_display, calculate_average_rating
import pandas as pd


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-super-secret-jwt-key-change-in-prod'  # Change in prod
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

db = SQLAlchemy(app)
jwt = JWTManager(app)

CORS(app, origins=["http://localhost:5173"])  # Enable CORS for Vite frontend

sentiment_analyzer = get_sentiment_analyzer()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400

    user = User(
        email=email,
        password_hash=generate_password_hash(password)
    )
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token
    }), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token
        })
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/analyze-review', methods=['POST'])
def analyze_review():
    print("=== DEBUG /analyze-review ===")
    print(f"Authorization: '{request.headers.get('Authorization')}'")
    print(f"Content-Type: '{request.headers.get('Content-Type')}'")
    print(f"All headers: {dict(request.headers)}")
    print("============================")
    data = request.get_json()
    review_text = data.get('review_text', '')

    if not review_text:
        return jsonify({'error': 'No review text provided'}), 400

    # Split reviews and analyze individually (to avoid 512 token limit)
    reviews_list = [line.strip() for line in review_text.split('\n') if line.strip()]
    
    # Detect aspects from each review
    all_aspects = set()
    for review in reviews_list:
        review_aspects = detect_aspects(review)
        all_aspects.update(review_aspects)
    
    aspects = list(all_aspects)

    # Inline individual sentiment analysis for consistent neutral detection
    def classify_with_threshold(result):
        label = result['label']
        score = result['score']
        if 'star' in label:
            stars = int(label.split()[0])
            if stars <= 2:
                sentiment = 'negative'
            elif stars == 3:
                sentiment = 'neutral'
            else:
                sentiment = 'positive'
        elif label == 'LABEL_0' or label == 'Negative' or label.lower() == 'negative':
            sentiment = 'negative'
        elif label == 'LABEL_1' or label == 'Neutral' or label.lower() == 'neutral':
            sentiment = 'neutral'
        elif label == 'LABEL_2' or label == 'Positive' or label.lower() == 'positive':
            sentiment = 'positive'
        else:
            sentiment = label.lower()
        return sentiment, score

    reviews = [line.strip() for line in review_text.split('\n') if line.strip()]
    positive = 0
    neutral = 0
    negative = 0
    individual_results = []

    for i, review in enumerate(reviews, start=1):
        review_to_analyze = review[:2000] if len(review) > 2000 else review
        if sentiment_analyzer is None:
            sentiment = 'neutral'
            confidence = 0.5
        else:
            result = sentiment_analyzer(review_to_analyze)[0]
            sentiment, confidence = classify_with_threshold(result)
        individual_results.append({
            'review_number': i,
            'text': review,
            'sentiment': sentiment,
            'confidence': round(confidence, 2)
        })
        if sentiment == "positive":
            positive += 1
        elif sentiment == "neutral":
            neutral += 1
        else:
            negative += 1

    summary = {
        'total_reviews': len(reviews),
        'positive': positive,
        'neutral': neutral,
        'negative': negative
    }
    positive_count = positive
    neutral_count = neutral
    negative_count = negative
    
    # Determine overall sentiment based on majority
    if positive_count >= neutral_count and positive_count >= negative_count:
        overall_sentiment = 'positive'
    elif negative_count >= neutral_count:
        overall_sentiment = 'negative'
    else:
        overall_sentiment = 'neutral'

    # Prepare aspect breakdown
    aspect_breakdown = {}
    if aspects:
        for aspect in aspects:
            aspect_breakdown[aspect] = {
                'positive': 1 if overall_sentiment == 'positive' else 0,
                'neutral': 1 if overall_sentiment == 'neutral' else 0,
                'negative': 1 if overall_sentiment == 'negative' else 0
            }
    else:
        aspect_breakdown = {
            'general': {
                'positive': 1 if overall_sentiment == 'positive' else 0,
                'neutral': 1 if overall_sentiment == 'neutral' else 0,
                'negative': 1 if overall_sentiment == 'negative' else 0
            }
        }

    # Overall sentiment counts (use actual counts from individual analysis)
    overall_positive = positive_count
    overall_neutral = neutral_count
    overall_negative = negative_count


    # Individual sentiments already computed above

    # Generate AI feedback for customers say
    customers_say = generate_customers_say(summary)

    # Calculate star rating for overall sentiment based on counts
    if individual_results:
        avg_confidence = sum(r['confidence'] for r in individual_results) / len(individual_results)
    else:
        avg_confidence = 0.5
    
    overall_stars = calculate_star_rating(overall_sentiment, avg_confidence)
    star_display = get_star_display(overall_stars)
    average_rating = calculate_average_rating(individual_results)

    # Add star ratings to individual reviews
    for review in individual_results:
        review_stars = calculate_star_rating(review['sentiment'], review['confidence'])
        review['star_rating'] = review_stars
        review['star_display'] = get_star_display(review_stars)

    # Reviews list (updated to include individual sentiments)
    reviews = individual_results

    response_data = {
        'overall_sentiment': {
            'positive': overall_positive,
            'neutral': overall_neutral,
            'negative': overall_negative
        },

        'star_rating': {
            'stars': overall_stars,
            'display': star_display,
            'average_rating': average_rating
        },

        'aspect_breakdown': aspect_breakdown,
        'customers_say': customers_say,
        'reviews': reviews,
        'individual_sentiments': individual_results,
        'summary': summary
    }

    return jsonify(response_data)

@app.route('/analyze-csv', methods=['POST'])
@jwt_required()
def analyze_csv():
    if 'csv_file' not in request.files:
        return jsonify({'error': 'No CSV file provided'}), 400

    file = request.files['csv_file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        df = pd.read_csv(file)

        required_col = 'reviews.text'
        if required_col not in df.columns:
            return jsonify({'error': f"Missing required column '{required_col}' in CSV."}), 400

        reviews = df[required_col].astype(str).tolist()
        if not reviews:
            return jsonify({'error': f"No data found in column '{required_col}'."}), 400

        # Return only the extracted review texts
        return jsonify({'reviews': reviews, 'count': len(reviews)})

    except Exception as e:
        return jsonify({'error': f'Error processing CSV: {str(e)}'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
