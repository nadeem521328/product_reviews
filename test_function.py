from IndividualSentiment import analyze_individual_sentiments

# Test with some negative reviews
test_text = """This product is terrible and I hate it
Worst purchase ever, complete waste of money
Absolutely awful quality, do not buy
I am very disappointed with this item
This is the worst thing I have ever bought
Complete garbage, do not waste your money
Horrible experience, never buying again
This sucks, total disappointment
Very bad product, do not recommend
Poor quality and terrible service"""

print("Testing analyze_individual_sentiments function:")
print("=" * 60)

individual_results, summary = analyze_individual_sentiments(test_text)

print(f"Summary: {summary}")
print("\nIndividual results:")
for result in individual_results:
    print(f"  {result['review_number']}: {result['sentiment']} ({result['confidence']:.3f}) - {result['text'][:50]}...")