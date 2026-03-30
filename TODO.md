# Task: Switch back to cardiffnlp/twitter-roberta-base-sentiment for 3-label predictions

## Steps:
- [x] 1. Edit sentiment_model.py: Change model to \"cardiffnlp/twitter-roberta-base-sentiment\"
- [ ] 2. Update hardcoded test files: testing/ex.py, testing/multi_sentiment.py, txt_file_sentiment.py
- [x] 3. Test: Run `python test_model.py` to verify load and 3-label output (LABEL_0/1/2) → SUCCESS: LABEL_2 (positive) with 0.99 score, no errors
- [ ] 4. Test app: Run `python app.py` and test /analyze-review with mixed reviews
- [ ] 5. Verify no errors, 3 labels working (neg/neu/pos)
- [x] Plan approved and TODO created

