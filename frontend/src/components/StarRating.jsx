import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StarRating = ({ data, reviews }) => {
  // Calculate average star rating from reviews
  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.star_rating || 0), 0) / reviews.length).toFixed(1)
    : 0;
  
  const avgStars = Math.round(parseFloat(averageRating));
  const starDisplay = '⭐'.repeat(avgStars) + '☆'.repeat(5 - avgStars);

  return (
    <Card sx={{ minHeight: 120 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Star Rating
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {averageRating}
          </Typography>
          <Typography variant="h5">
            {starDisplay}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StarRating;
