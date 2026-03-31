import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import OverallSentiment from '../components/OverallSentiment';
import CustomersSay from '../components/CustomersSay';
import AspectTable from '../components/AspectTable';
import SentimentCharts from '../components/SentimentCharts';
import ReviewsList from '../components/ReviewsList';
import TotalReviews from '../components/TotalReviews';
import StarRating from '../components/StarRating';

const Dashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, py: 4 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          No data available. Please search for a product first.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6, mt: 2, p: 3, borderRadius: 3, backgroundColor: 'background.paper', boxShadow: 1 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 800 }}>
                  Analysis Dashboard
        </Typography>
        {data.product_name && (
          <Typography variant="h5" color="text.secondary">
            {data.product_name}
          </Typography>
        )}
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <OverallSentiment data={data} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '400px', gap: 10 }}>
            <Box sx={{ flex: 1, maxHeight: '100px' }}>
              <TotalReviews reviews={data.reviews} summary={data.summary} />
            </Box>
            <Box sx={{ flex: 1, minHeight: '150px' }}>
              <StarRating data={data} reviews={data.reviews} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={12} >
          <SentimentCharts summary={data.summary} />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mb: 6, mt: 2, borderRadius: 3, backgroundColor: 'background.paper', boxShadow: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/individual-sentiments', { state: { data } })}
              sx={{ py: 3, px: 3, borderRadius: 3 }}
            >
              View Individual Sentiment Analysis
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ReviewsList reviews={data.reviews} />
        </Grid>
        {data.customers_say && (
          <Grid item xs={12}>
            <CustomersSay customersSay={data.customers_say} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
