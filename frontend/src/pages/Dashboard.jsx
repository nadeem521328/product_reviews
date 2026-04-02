import React from 'react';
import { Container, Typography, Grid, Box, Button, Card, Stack, Chip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import OverallSentiment from '../components/OverallSentiment';
import CustomersSay from '../components/CustomersSay';
import AspectTable from '../components/AspectTable';
import SentimentCharts from '../components/SentimentCharts';
import ReviewsList from '../components/ReviewsList';
import TotalReviews from '../components/TotalReviews';
import StarRating from '../components/StarRating';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: '18px' }}>
          <Typography variant="h5" gutterBottom>
            No dashboard data yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Run an analysis from the search page to populate this dashboard.
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => navigate('/search')}>
            Go to analyzer
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          position: 'relative',
          isolation: 'isolate',
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: '18px',
          border: '1px solid',
          borderColor: 'rgba(111, 160, 166, 0.22)',
          background: 'linear-gradient(145deg, rgba(18,52,59,0.97), rgba(28,57,64,0.92))',
          color: '#FAF8F5',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: { xs: '-18px', md: '-26px' },
            borderRadius: '32px',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 50% 0%, rgba(111,160,166,0.24) 0%, rgba(200,145,102,0.16) 40%, rgba(200,145,102,0) 74%)'
                : 'radial-gradient(circle at 50% 0%, rgba(31,78,87,0.14) 0%, rgba(184,116,68,0.10) 40%, rgba(184,116,68,0) 74%)',
            filter: 'blur(28px)',
            zIndex: -1,
            pointerEvents: 'none',
          },
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
          <Chip label="Dashboard" color="secondary" />
          <Chip label={`${data.summary?.total_reviews || 0} reviews analyzed`} variant="outlined" />
        </Stack>
        <Typography variant="h2" component="h1" gutterBottom>
          Analysis dashboard
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 760, mb: 3, color: 'rgba(199, 210, 214, 0.84)' }}>
          A clearer product-style overview of review sentiment, star rating trends, aspect signals, and individual feedback.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/individual-sentiments', { state: { data } })}>
            View individual sentiment analysis
          </Button>
          <Button variant="outlined" onClick={() => navigate('/search')}>
            Analyze another batch
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <OverallSentiment data={data} />
        </Grid>
        <Grid item xs={12} lg={7}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TotalReviews reviews={data.reviews} summary={data.summary} />
            </Grid>
            <Grid item xs={12}>
              <StarRating reviews={data.reviews} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <SentimentCharts summary={data.summary} />
        </Grid>
        <Grid item xs={12}>
          <AspectTable aspectBreakdown={data.aspect_breakdown} />
        </Grid>
        {data.customers_say && (
          <Grid item xs={12}>
            <CustomersSay customersSay={data.customers_say} />
          </Grid>
        )}
        <Grid item xs={12}>
          <ReviewsList reviews={data.reviews} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
