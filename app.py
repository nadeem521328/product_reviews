import sys
import os

# Fix for Unicode encoding issues on Windows
if os.name == 'nt':  # Windows
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

from flask import Flask, request, jsonify
from flask_cors import CORS
from templates import detect_aspects
from sentiment_model import load_sentiment_model
from IndividualSentiment import analyze_individual_sentiments
from feedback_generator import generate_customers_say
from rating import calculate_star_rating, get_star_display, calculate_average_rating
import pandas as pd


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

sentiment_analyzer = load_sentiment_model()

@app.route('/analyze-review', methods=['POST'])
def analyze_review():
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

    # Use thresholded individual analysis for consistent neutral detection
    individual_results, summary = analyze_individual_sentiments(review_text)
    positive_count = summary['positive']
    neutral_count = summary['neutral']
    negative_count = summary['negative']
    
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
