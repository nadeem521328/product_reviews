import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import IndividualSentiments from '../components/IndividualSentiments';

const IndividualSentimentsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, py: 6 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          No data available. Please go back to the dashboard.
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 902 }}>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 800 }}>
          Individual Sentiment Analysis
        </Typography>
        {data.product_name && (
          <Typography variant="h5" color="text.secondary">
            {data.product_name}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/dashboard', { state: { data } })}>
            Back to Dashboard
          </Button>
        </Box>
      </Box>
      <IndividualSentiments individualSentiments={data.individual_sentiments} />
    </Container>
  );
};

export default IndividualSentimentsPage;