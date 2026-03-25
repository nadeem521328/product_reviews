import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { analyzeReview } from '../services/api';
import ReviewCounter from '../components/ReviewCounter';

const Search = () => {
  const [reviewText, setReviewText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
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

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size too large. Maximum 5MB.');
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
        <TextField
          fullWidth
          multiline
          rows={15}
          label="Enter Review Text or upload file below"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          margin="normal"
          required
          sx={{ '& .MuiInputBase-input': { color: 'black' }, '& .MuiInputLabel-root': { backgroundColor: 'white', padding: '0 4px' }, '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
        />
        <ReviewCounter reviewText={reviewText} />
        
        {/* File Upload */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Or upload a .txt file containing reviews (one per line):
          </Typography>
          <Input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            inputProps={{ 'aria-label': 'Upload reviews file' }}
            sx={{ mr: 2 }}
          />
          {selectedFile && (
            <Typography variant="body2" color="success.main" sx={{ ml: 2, display: 'inline' }}>
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </Typography>
          )}
        </Box>
        {fileError && <Alert severity="error" sx={{ mt: 1 }}>{fileError}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Search;
