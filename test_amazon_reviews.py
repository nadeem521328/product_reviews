import sys
import pandas as pd
import io

# Simulate the CSV logic from app.py with amazon_reviews.csv headers
headers = ['id','asins','brand','categories','colors','dateAdded','dateUpdated','dimension','ean','keys','manufacturer','manufacturerNumber','name','prices','reviews.date','reviews.doRecommend','reviews.numHelpful','reviews.rating','reviews.sourceURLs','reviews.text','reviews.title','reviews.userCity','reviews.userProvince','reviews.username','sizes','upc','weight']

# Mock data for lengths
mock_data = {
    'id': ['AVpe7AsMilAPnD_xQ78G'],
    'asins': ['B00QJDU3KY'],
    'brand': ['Amazon'],
    'name': ['Kindle Paperwhite'],
    'prices': ['[{"amountMax":139.99,...}]'],
    'reviews.text': ['I initially had trouble deciding between the paperwhite and the voyage...'],
    'reviews.title': ['Paperwhite voyage, no regrets!']
    # Mock other cols short
}

df = pd.DataFrame(mock_data)[headers]

print('Mock columns:', df.columns.tolist())

str_cols = df.select_dtypes(include=['object']).columns.tolist()
print('String columns:', str_cols)

review_keywords = ['review', 'reviews', 'text', 'Review', 'Text', 'review text', 'customer review', 'Review Text', 'comment', 'comments', 'feedback', 'Feedback', 'description', 'opinion']

review_col = None
for col in str_cols:
    if any(keyword.lower() in col.lower() for keyword in review_keywords):
        review_col = col
        print(f'Match found: {col}')
        break

print('Selected review_col:', review_col)

if review_col is None:
    lens = {c: df[c].astype(str).str.len().mean() for c in str_cols}
    print('Col lengths:', lens)
    review_col = max(str_cols, key=lambda c: df[c].astype(str).str.len().mean())
print('Final:', review_col)
