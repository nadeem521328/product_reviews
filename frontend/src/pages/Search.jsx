import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress, Input, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api, { analyzeReview } from '../services/api';
import ReviewCounter from '../components/ReviewCounter';

const Search = () => {
  const [reviewText, setReviewText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvSelectedFile, setCsvSelectedFile] = useState(null);

const [inputMode, setInputMode] = useState(0); // 0:manual, 1:txt, 2:csv
  const [fileError, setFileError] = useState('');
  const [csvError, setCsvError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setFileError('Please select a .txt file.');
      setSelectedFile(null);
      return;
    }

    // Validate size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setFileError('File size too large. Maximum 100MB.');
      setSelectedFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setReviewText(content);
      setFileError('');
    };
    reader.onerror = () => {
      setFileError('Error reading file.');
    };
    reader.readAsText(file);
    setSelectedFile(file);
  };

  const handleCsvToText = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvError('Please select a .csv file.');
      setCsvSelectedFile(null);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setCsvError('File size too large. Maximum 100MB.');
      setCsvSelectedFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvContent = event.target.result;
        const lines = csvContent.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
          setCsvError('CSV file is empty.');
          return;
        }

        // Parse header
        const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

        // Strict behavior: require reviews.text column exactly
        const reviewColIndex = header.findIndex(col => col.trim().toLowerCase() === 'reviews.text');
        if (reviewColIndex === -1) {
          setCsvError('CSV must contain a "reviews.text" column. Found: ' + header.join(', '));
          return;
        }

        // Parse data rows, basic quote handling
        const reviews = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = [];
          let col = '';
          let inQuote = false;
          for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char === '"') {
              inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
              cols.push(col.trim());
              col = '';
            } else {
              col += char;
            }
          }
          cols.push(col.trim());

          if (cols[reviewColIndex] && cols[reviewColIndex].trim()) {
            reviews.push(cols[reviewColIndex].replace(/"/g, ''));
          }
        }

        if (reviews.length === 0) {
          setCsvError('No reviews found in CSV. Check column names.');
          return;
        }

        const reviewTextContent = reviews.join('\n');
        setReviewText(reviewTextContent);
        setInputMode(2);
        setCsvError('');
        setCsvSelectedFile(file);
      } catch (err) {
        setCsvError('Error parsing CSV: ' + err.message);
      }
    };
    reader.onerror = () => {
      setCsvError('Error reading CSV file.');
    };
    reader.readAsText(file);
  };

  const handleRawDataExtract = () => {
    if (!rawData.trim()) {
      setError('Please enter raw data first.');
      return;
    }

    // Smart Amazon review extraction: split by new reviewer + rating pattern
    const blocks = rawData.split(/\n\n[A-Za-z][\w\s]+?\n\d+\.\d+\s+out of 5 stars/i);
    const reviews = [];
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      const match = block.match(/Verified Purchase\s*\n(.*?)(?=Customer image|Helpful|Report|$)/is);
      if (match) {
        let text = match[1]
          .replace(/\n\s*\n/g, ' ')
        .replace(/Customer image|helpful[\\s\\S]*?report/gi, 'i')
          .trim();
        if (text.length > 10 && !text.match(/^Flavour Name/i)) {
          reviews.push(text);
        }
      }
    }

    if (reviews.length === 0) {
      // Fallback logic for non-Amazon or malformed
      let fallbackReviews = rawData.split('\n\n')
        .map(para => para.trim())
        .filter(para => para.length > 10);
      if (fallbackReviews.length === 0) {
        fallbackReviews = rawData.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 10);
      }
      setReviewText(fallbackReviews.slice(0, 20).join('\n\n'));
      setRawData('');
      setError('');
      return;
    }

    setReviewText(reviews.join('\n\n'));
    setRawData('');
    setError('');
  };

  const handleCsvDirectAnalyze = async () => {
    const file = csvSelectedFile;
    if (!file) {
      setCsvError('No CSV file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', file);

    setLoading(true);
    setCsvError('');
    try {
      const { data } = await api.post('/analyze-csv', formData);
      navigate('/dashboard', { state: { data } });
    } catch (err) {
      setCsvError(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError('Please enter a review text.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await analyzeReview(reviewText);
      navigate('/dashboard', { state: { data } });
    } catch (err) {
      setError('Error analyzing review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ mt: 8, px: 4, width: '50vw', margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Analyze Review
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Box sx={{ mb: 2 }}>
        <Tabs value={inputMode} onChange={(_, newValue) => setInputMode(newValue)} variant="fullWidth">
            <Tab label="Manual Text" />
            <Tab label="TXT File" />
            <Tab label="CSV File" />
          </Tabs>
        </Box>
        

        
        <TextField
          fullWidth
          multiline
          rows={15}
label={inputMode === 2 ? 'CSV Reviews Loaded (edit if needed)' : inputMode === 1 ? 'TXT Reviews Loaded' : 'Enter Review Text'}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          margin="normal"
          required
          sx={{ '& .MuiInputBase-input': { color: 'black' }, '& .MuiInputLabel-root': { backgroundColor: 'white', padding: '0 4px' }, '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
        />
        <ReviewCounter reviewText={reviewText} />
        
{inputMode === 1 && (
          <>
            {/* TXT File Upload */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Upload .txt file (one review per line):
              </Typography>
              <Input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                inputProps={{ 'aria-label': 'Upload TXT file' }}
                sx={{ mr: 2 }}
              />
              {selectedFile && (
                <Typography variant="body2" color="success.main" sx={{ ml: 2, display: 'inline' }}>
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </Typography>
              )}
            </Box>
            {fileError && <Alert severity="error" sx={{ mt: 1 }}>{fileError}</Alert>}
          </>
        )}

{inputMode === 2 && (
          <>
            {/* CSV Upload to Text */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Upload .csv (columns: review/text/comment):
              </Typography>
              <Input
                type="file"
                accept=".csv"
                onChange={handleCsvToText}
                inputProps={{ 'aria-label': 'Load CSV reviews to textarea' }}
                sx={{ mr: 2 }}
              />
              {csvSelectedFile && (
                <Typography variant="body2" color="success.main" sx={{ ml: 2, display: 'inline-block', whiteSpace: 'nowrap' }}>
                  Loaded: {csvSelectedFile.name}
                </Typography>
              )}
            </Box>
            {csvError && <Alert severity="error" sx={{ mt: 1 }}>{csvError}</Alert>}
            {csvSelectedFile && (
              <Box sx={{ mt: 1 }}>
                <Button variant="outlined" size="small" onClick={handleCsvDirectAnalyze} disabled={loading}>
                  Direct Analyze CSV (skip edit)
                </Button>
              </Box>
            )}
          </>
        )}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ mt: 2, py: 1.5, width: "200px" }}
          >
            Analyze Review
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Search;
