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
    <Card sx={{ minHeight: 180 }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h6" align="center">
              Total Reviews
            </Typography>
            <Typography variant="h3" color="primary" align="center">
              {totalReviews}
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary">
              {starDisplay}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" align="center">
              Positive
            </Typography>
            <Typography variant="h4" color="sentiment.positive" align="center">
              {positive}
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: 'sentiment.positive' }}>
              {positivePercent}%
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" align="center">
              Neutral
            </Typography>
            <Typography variant="h4" color="sentiment.neutral" align="center">
              {neutral}
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: 'sentiment.neutral' }}>
              {neutralPercent}%
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" align="center">
              Negative
            </Typography>
            <Typography variant="h4" color="sentiment.negative" align="center">
              {negative}
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: 'sentiment.negative' }}>
              {negativePercent}%
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalReviews;
