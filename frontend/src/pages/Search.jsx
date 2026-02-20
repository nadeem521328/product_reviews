import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { analyzeReview } from '../services/api';
import ReviewCounter from '../components/ReviewCounter';

const Search = () => {
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
          label="Enter Review Text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          margin="normal"
          required
          sx={{ '& .MuiInputBase-input': { color: 'black' }, '& .MuiInputLabel-root': { backgroundColor: 'white', padding: '0 4px' }, '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
        />
        <ReviewCounter reviewText={reviewText} />
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
