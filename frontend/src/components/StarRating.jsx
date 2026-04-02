import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

const StarRating = ({ reviews }) => {
  const averageRating = reviews?.length
    ? (reviews.reduce((sum, review) => sum + (review.star_rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const avgStars = Math.round(Number(averageRating));

  return (
    <Card sx={{ borderRadius: '18px', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Average rating
        </Typography>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {averageRating}/5
        </Typography>
        <Stack direction="row" spacing={0.25} sx={{ mb: 2 }}>
          {Array.from({ length: 5 }).map((_, index) =>
            index < avgStars ? (
              <StarRoundedIcon key={index} sx={{ color: 'secondary.main', fontSize: 32 }} />
            ) : (
              <StarBorderRoundedIcon key={index} sx={{ color: 'secondary.main', fontSize: 32 }} />
            ),
          )}
        </Stack>
        <Box sx={{ p: 2, borderRadius: 4, backgroundColor: 'background.default' }}>
          <Typography variant="body2" color="text.secondary">
            Based on {reviews?.length || 0} analyzed reviews.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StarRating;
