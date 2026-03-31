# Review Extraction Fix Plan

## Step 1: Fix Frontend Extraction (Search.jsx)
- Edit `handleExtractReviews()` with lookahead regex and Python-aligned logic.
- Test user's sample → extract clean "Received spoiled/damaged socket"

## Step 2: Fix Backend Fragmentation (app.py)
- Detect raw Amazon input → use extract_review_texts() before analysis.

## Step 3: Test
- Frontend: Open /search, paste sample, Extract → "Extracted 1 clean review" with proper text.
- Backend: Analyze → 1 review, not fragmented lines.

## Progress
- [x] Step 1 (Search_fixed.jsx created)
- [ ] Step 2
- [ ] Step 3

Status: Ready to implement.
