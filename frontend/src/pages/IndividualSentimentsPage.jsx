import React from 'react';
import { Container, Typography, Box, Button, Card, Stack, Chip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import IndividualSentiments from '../components/IndividualSentiments';

const IndividualSentimentsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: '18px' }}>
          <Typography variant="h5" gutterBottom>
            No analysis data available
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Go back to the dashboard after running a review analysis.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: '18px',
          border: '1px solid',
          borderColor: 'rgba(185, 152, 90, 0.16)',
          background: 'linear-gradient(145deg, rgba(36,29,40,0.98), rgba(49,39,54,0.92))',
          color: '#FAF7F2',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
          boxShadow: '0 24px 60px rgba(12, 10, 16, 0.30)',
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 30px 70px rgba(12, 10, 16, 0.40)',
              borderColor: 'rgba(185, 152, 90, 0.22)',
            },
          },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label="Detailed View" color="secondary" />
          <Chip label={`${data.individual_sentiments?.length || 0} reviews`} variant="outlined" />
        </Stack>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Individual sentiment analysis
        </Typography>
        <Typography sx={{ mb: 3, color: 'rgba(212, 200, 210, 0.88)' }}>
          Inspect the sentiment, confidence, and rating for each review in the analyzed batch.
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/dashboard', { state: { data } })}>
          Back to dashboard
        </Button>
      </Box>
      <IndividualSentiments individualSentiments={data.individual_sentiments} />
    </Container>
  );
};

export default IndividualSentimentsPage;
