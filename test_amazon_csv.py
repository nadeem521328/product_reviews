import pandas as pd

df = pd.read_csv('amazon_reviews.csv')

print('Columns:', df.columns.tolist())
str_cols = df.select_dtypes(include=['object']).columns.tolist()
print('String columns:', str_cols)

review_keywords = ['review', 'reviews', 'text', 'Review', 'Text', 'review text', 'customer review', 'Review Text', 'comment', 'comments', 'feedback', 'Feedback', 'description', 'opinion']

review_col = None
for col in str_cols:
    if any(keyword.lower() in col.lower() for keyword in review_keywords):
        review_col = col
        break

print('Keyword match:', review_col)

if review_col is None and str_cols:
    review_col = max(str_cols, key=lambda c: df[c].astype(str).str.len().mean())
print('Fallback longest:', review_col)

if 'reviews.text' in df.columns:
    print('Sample reviews.text:', df['reviews.text'].dropna().iloc[0][:200])
    reviews = df['reviews.text'].dropna().astype(str).tolist()
    print('Reviews count:', len(reviews))
    print('First review preview:', reviews[0][:100])

print('Done')
