from sentiment_model import load_sentiment_model
p = load_sentiment_model()
print(p('This is a great product!'))
print('Model load test complete.')
