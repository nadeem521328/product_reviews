# TODO: Fix CSV Review Column Selection (COMPLETED ✅)
- [x] Step 1: Create this TODO.md
- [x] Step 2: Edit app.py to expand review column detection and improve fallback logic
- [x] Step 3: Test with test_csv_reviews.py and sample CSVs with various column names (e.g., 'customer review', first col non-review) - verified with test_column_selection.py
- [x] Step 4: Verify fix, update TODO, complete task

Changes: app.py /analyze-csv now uses case-insensitive keyword matching for columns like 'review text', 'customer review', etc., with fallback to longest string column. Logs selected column.
