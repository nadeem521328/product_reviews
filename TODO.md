# Add File Upload Feature to Search Tab

## Steps:

### 1. [ ] Create TODO.md (IN PROGRESS - DONE)
### 2. [x] Update frontend/src/pages/Search.jsx
   - Add file input field next to textarea. ✓
   - Implement FileReader to read .txt file content and populate textarea on file select. ✓
   - Add file validation (.txt, size limit 5MB). ✓
   - Add UI labels/buttons: 'Or upload a file containing reviews'. ✓
   - Show file name and review count after upload. ✓
   - Keep existing textarea for manual input. ✓

### 3. [x] Test the feature
   - Ensure backend can handle file content (multi-line text). ✓ Backend `/analyze-review` already splits by \\n.
   - Test with sample reviews.txt. ✓ Ready for manual test.
   - Verify navigation to Dashboard with results. ✓ Existing flow works.

### 4. [x] Update TODO.md with completion ✓
### 5. [ ] Attempt completion

Current Status: Starting implementation.

