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

  const positivePercent = totalReviews > 0 ? ((positive / totalReviews) * 100).toFixed(1) : 0;
  const neutralPercent = totalReviews > 0 ? ((neutral / totalReviews) * 100).toFixed(1) : 0;
  const negativePercent = totalReviews > 0 ? ((negative / totalReviews) * 100).toFixed(1) : 0;

  return (
    <Card sx={{ minHeight: 140, display: 'flex', alignItems: 'center' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" align="left">
              Total Reviews
            </Typography>
            <Typography variant="h3" color="primary" align="left">
              {totalReviews}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" align="left">
              Positive
            </Typography>
            <Typography variant="h4" color="sentiment.positive" align="left">
              {positive}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" align="left">
              Neutral
            </Typography>
            <Typography variant="h4" color="sentiment.neutral" align="left">
              {neutral}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" align="left">
              Negative
            </Typography>
            <Typography variant="h4" color="sentiment.negative" align="left">
              {negative}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalReviews;
