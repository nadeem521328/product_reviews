import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import OverallSentiment from '../components/OverallSentiment';
import CustomersSay from '../components/CustomersSay';
import AspectTable from '../components/AspectTable';
import SentimentCharts from '../components/SentimentCharts';
import ReviewsList from '../components/ReviewsList';
import TotalReviews from '../components/TotalReviews';
import IndividualSentiments from '../components/IndividualSentiments';

const Dashboard = () => {
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return <Typography variant="h6">No data available. Please search for a product first.</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6, mt: 2 }}>
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
          <SentimentCharts summary={data.summary} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TotalReviews reviews={data.reviews} summary={data.summary} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ReviewsList reviews={data.reviews} />
        </Grid>
        <Grid item xs={12}>
          <IndividualSentiments individualSentiments={data.individual_sentiments} />
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
