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
    <Card sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CardContent sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2,
        textAlign: 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 1, 
          flexWrap: 'nowrap',
          mb: 0.5
        }}>
          <Typography variant="h4" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
            Star Rating :
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
            [ {averageRating} / 5 ]
          </Typography>
          <Typography variant="h5" sx={{ whiteSpace: 'nowrap' }}>
            {starDisplay}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Based on {reviews?.length || 0} reviews analysed
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StarRating;

