import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const TotalReviews = ({ reviews, summary }) => {
  const totalReviews = summary ? summary.total_reviews : (reviews ? reviews.length : 0);
  const positive = summary ? summary.positive : 0;
  const neutral = summary ? summary.neutral : 0;
  const negative = summary ? summary.negative : 0;
  
  // Calculate average star rating from reviews if available
  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.star_rating || 0), 0) / reviews.length).toFixed(1)
    : 0;
  
  // Generate star display based on average
  const avgStars = Math.round(parseFloat(averageRating));
  const starDisplay = '⭐'.repeat(avgStars) + '☆'.repeat(5 - avgStars);


  return (
    <Card sx={{ minHeight: 130 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="h6" component="div" align="center">
              Total Reviews
            </Typography>
            <Typography variant="h4" color="primary" align="center">
              {totalReviews}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" component="div" align="center">
              Positive
            </Typography>
            <Typography variant="h4" color="green" align="center">
              {positive}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" component="div" align="center">
              Neutral
            </Typography>
            <Typography variant="h4" color="orange" align="center">
              {neutral}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" component="div" align="center">
              Negative
            </Typography>
            <Typography variant="h4" color="red" align="center">
              {negative}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalReviews;
