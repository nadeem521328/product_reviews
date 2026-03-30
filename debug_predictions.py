from sentiment_model import load_sentiment_model
analyzer = load_sentiment_model()
if analyzer:
    tests = [
        'This is a great product! Love it.',
        'This product is terrible, waste of money.',
        'The product is okay, nothing special.',
        'Absolutely amazing! Best purchase ever.',
        'Horrible quality, broke immediately.',
        'Average performance, meets expectations.'
    ]
    for i, text in enumerate(tests, 1):
        result = analyzer(text)[0]
        print(f'Test {i}: "{text}"')
        print(f'  Raw: {result["label"]} ({result["score"]:.3f})')
        print()
else:
    print('Model failed to load')

