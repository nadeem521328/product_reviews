import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Review Sentiment Analysis
      </Typography>
      <Typography variant="h5" component="p" gutterBottom>
        Analyze individual reviews through advanced sentiment analysis.
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Our system analyzes a single review to provide insights into overall sentiment, aspect-based feedback, and a summarized "Customers Say" overview.
      </Typography>
      <Box>
        <Button variant="contained" size="large" onClick={() => navigate('/search')}>
          Analyze Review
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
