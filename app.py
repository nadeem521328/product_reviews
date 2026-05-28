import sys
import os

# Fix for Unicode encoding issues on Windows
if os.name == 'nt':  # Windows
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    verify_jwt_in_request,
    get_jwt_identity,
)
from flask_jwt_extended.exceptions import JWTExtendedException
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from datetime import timedelta, datetime
from dotenv import load_dotenv
from templates import detect_aspects
from sentiment_model_fixed import load_sentiment_model
from extract_reviews import extract_review_texts
from feedback_generator import generate_customers_say, generate_aspect_customers_say
from rating import calculate_star_rating, get_star_display, calculate_average_rating
from providers.url_review_provider import URLReviewProviderError, get_reviews_for_amazon_url
import pandas as pd
from jwt.exceptions import InvalidTokenError

load_dotenv()

def _is_truthy(value, default=False):
    if value is None:
        return default
    return str(value).strip().lower() in ("1", "true", "yes", "on")

def _parse_origins(origins_str):
    if not origins_str:
        return ["http://localhost:5173"]
    return [origin.strip() for origin in origins_str.split(",") if origin.strip()]

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-only-secret-change-me')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=int(os.getenv('JWT_EXPIRES_HOURS', '24')))
app.config['JWT_VERIFY_SUB'] = False
flask_debug = _is_truthy(os.getenv('FLASK_DEBUG'), default=False)

if not flask_debug and app.config['JWT_SECRET_KEY'] == 'dev-only-secret-change-me':
    raise RuntimeError("JWT_SECRET_KEY must be set for non-debug deployments.")

db = SQLAlchemy(app)
jwt = JWTManager(app)


@jwt.user_identity_loader
def user_identity_lookup(user_id):
    return str(user_id)

cors_origins = _parse_origins(os.getenv('CORS_ORIGINS'))
CORS(app, origins=cors_origins)
debug_logs = _is_truthy(os.getenv('DEBUG_LOGS'), default=False)

# Fixed model loader (offline cache)
sentiment_analyzer = load_sentiment_model()
print(f"App startup analyzer loaded: {sentiment_analyzer is not None}")


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


def classify_with_keyword_fallback(text):
    positive_words = {
        "good", "great", "excellent", "amazing", "awesome", "best", "love", "liked",
        "satisfied", "happy", "smooth", "fast", "perfect", "fantastic", "nice", "helpful"
    }
    negative_words = {
        "bad", "worst", "poor", "terrible", "awful", "hate", "hated", "slow", "broken",
        "issue", "problem", "bug", "disappointed", "disappointing", "waste", "useless", "refund"
    }

    words = [w.strip(".,!?;:()[]{}\"'").lower() for w in text.split()]
    pos_hits = sum(1 for w in words if w in positive_words)
    neg_hits = sum(1 for w in words if w in negative_words)

    if pos_hits > neg_hits:
        return "positive", 0.62
    if neg_hits > pos_hits:
        return "negative", 0.62
    return "neutral", 0.5


def normalize_reviews(review_text):
    extracted_reviews = extract_review_texts(review_text)
    if extracted_reviews:
        return extracted_reviews
    return [line.strip() for line in review_text.split('\n') if line.strip()]


def analyze_review_lines(review_text):
    reviews = normalize_reviews(review_text)
    positive = 0
    neutral = 0
    negative = 0
    individual_results = []

    for i, review in enumerate(reviews, start=1):
        review_to_analyze = review[:2000] if len(review) > 2000 else review
        if sentiment_analyzer is None:
            sentiment, confidence = classify_with_keyword_fallback(review_to_analyze)
        else:
            result = sentiment_analyzer(review_to_analyze)[0]
            sentiment, confidence = classify_with_threshold(result)
            if debug_logs:
                print(f"DEBUG Review {i}: raw={result}, classified={sentiment}({confidence:.3f})")

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

    if positive >= neutral and positive >= negative:
        overall_sentiment = 'positive'
    elif negative >= neutral:
        overall_sentiment = 'negative'
    else:
        overall_sentiment = 'neutral'

    return reviews, individual_results, summary, overall_sentiment

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'


class AnalysisHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    original_review_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class PendingAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True, index=True)
    original_review_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


def queue_analysis_for_later_history(user_id, review_text):
    """
    Keep the current dashboard entry out of history until the next analysis.

    When a user analyzes a new entry, their previous pending entry becomes a
    history entry, and the new entry becomes the pending/current dashboard item.
    Because pending entries are stored in SQLite, this also works after restart.
    """
    user_id = int(user_id)
    existing_pending = PendingAnalysis.query.filter_by(user_id=user_id).first()

    if existing_pending:
        db.session.add(AnalysisHistory(
            user_id=user_id,
            original_review_text=existing_pending.original_review_text,
            created_at=existing_pending.created_at
        ))
        existing_pending.original_review_text = review_text
        existing_pending.created_at = datetime.utcnow()
    else:
        db.session.add(PendingAnalysis(
            user_id=user_id,
            original_review_text=review_text
        ))

    db.session.commit()

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

@app.route('/import-amazon-reviews', methods=['POST'])
def import_amazon_reviews():
    """
    Import review text from an Amazon product URL.

    This route only prepares plain review lines for the existing review textbox.
    It does not run sentiment analysis or change the current NLP pipeline.
    """
    data = request.get_json(silent=True) or {}
    product_url = (data.get('url') or data.get('amazon_url') or '').strip()

    if not product_url:
        return jsonify({'error': 'Amazon product URL is required.'}), 400

    try:
        result = get_reviews_for_amazon_url(product_url)
    except URLReviewProviderError as error:
        return jsonify({'error': str(error)}), 400

    return jsonify(result)

@app.route('/analyze-review', methods=['POST'])
def analyze_review():
    if debug_logs:
        print("=== DEBUG /analyze-review ===")
        print(f"DEBUG: sentiment_analyzer active: {sentiment_analyzer is not None}")
        print(f"Content-Type: '{request.headers.get('Content-Type')}'")
        print("============================")
    data = request.get_json()
    review_text = data.get('review_text', '')
    cleaned_review_text = review_text.strip()

    current_user_id = None
    try:
        verify_jwt_in_request(optional=True)
        current_user_id = get_jwt_identity()
    except (JWTExtendedException, InvalidTokenError) as auth_error:
        if debug_logs:
            print(f"DEBUG: ignoring invalid optional JWT on /analyze-review: {auth_error}")

    if not review_text:
        return jsonify({'error': 'No review text provided'}), 400

    # Extract review bodies from raw marketplace text when possible.
    reviews_list = normalize_reviews(review_text)
    
    # Detect aspects from each review
    all_aspects = set()
    for review in reviews_list:
        review_aspects = detect_aspects(review)
        all_aspects.update(review_aspects)
    
    aspects = list(all_aspects)

    reviews, individual_results, summary, overall_sentiment = analyze_review_lines(review_text)
    if debug_logs:
        print(f"DEBUG Final summary: {summary}")
    positive_count = summary['positive']
    neutral_count = summary['neutral']
    negative_count = summary['negative']

    # Prepare aspect breakdown with per-aspect sentiment
    aspect_breakdown = {}
    for i, review in enumerate(reviews_list):
        review_aspects = detect_aspects(review)
        review_sentiment = individual_results[i]['sentiment'] if i < len(individual_results) else 'neutral'
        for aspect in review_aspects:
            if aspect not in aspect_breakdown:
                aspect_breakdown[aspect] = {'positive': 0, 'neutral': 0, 'negative': 0}
            aspect_breakdown[aspect][review_sentiment] += 1
    
    if not aspect_breakdown:
        aspect_breakdown = {
            'general': {
                'positive': positive_count,
                'neutral': neutral_count,
                'negative': negative_count
            }
        }

    # Overall sentiment counts (use actual counts from individual analysis)
    overall_positive = positive_count
    overall_neutral = neutral_count
    overall_negative = negative_count


    # Individual sentiments already computed above

    # Generate aspect-based AI feedback for customers say
    customers_say = generate_aspect_customers_say(aspect_breakdown, summary)

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

    if current_user_id and cleaned_review_text:
        queue_analysis_for_later_history(current_user_id, cleaned_review_text)

    return jsonify(response_data)


@app.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    current_user_id = get_jwt_identity()
    history_entries = (
        AnalysisHistory.query
        .filter_by(user_id=int(current_user_id))
        .order_by(AnalysisHistory.created_at.desc())
        .limit(1)
        .all()
    )

    history_payload = []
    history_reviews = []

    for entry in history_entries:
        _, individual_results, _, overall_sentiment = analyze_review_lines(entry.original_review_text)
        history_payload.append({
            'id': entry.id,
            'original_review_text': entry.original_review_text,
            'sentiment': overall_sentiment,
            'created_at': entry.created_at.isoformat() + 'Z',
            'reviews': individual_results,
        })

        for review in individual_results:
            history_reviews.append({
                'history_id': entry.id,
                'created_at': entry.created_at.isoformat() + 'Z',
                'review_number': len(history_reviews) + 1,
                'text': review['text'],
                'sentiment': review['sentiment'],
                'confidence': review['confidence'],
            })

    return jsonify({
        'history': history_payload,
        'history_reviews': history_reviews,
    })

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
    app.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', '5000')),
        debug=flask_debug
    )
