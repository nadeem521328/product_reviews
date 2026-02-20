import React from 'react';
import { Typography } from '@mui/material';

const ReviewCounter = ({ reviewText }) => {
  const countReviews = (text) => {
    if (!text.trim()) return 0;
    return text.split('\n').filter(line => line.trim() !== '').length;
  };

  const reviewCount = countReviews(reviewText);

  return (
    <Typography variant="body1" sx={{ mt: 1 }}>
      Total Reviews: {reviewCount}
    </Typography>
  );
};

export default ReviewCounter;
