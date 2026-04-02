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
          borderColor: 'divider',
          background: 'linear-gradient(145deg, rgba(18,52,59,0.10), rgba(184,116,68,0.10))',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 30px 70px rgba(15, 23, 42, 0.14)',
              borderColor: 'rgba(31, 78, 87, 0.22)',
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
        <Typography color="text.secondary" sx={{ mb: 3 }}>
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
