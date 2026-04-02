import React from 'react';
import { Box, Chip, Stack } from '@mui/material';

const ReviewCounter = ({ reviewText }) => {
  const reviewCount = reviewText.trim()
    ? reviewText.split('\n').filter((line) => line.trim() !== '').length
    : 0;

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`Detected lines: ${reviewCount}`} color="primary" variant="outlined" />
        <Chip label={reviewCount > 0 ? 'Ready for analysis' : 'Waiting for review text'} color="secondary" variant="outlined" />
      </Stack>
    </Box>
  );
};

export default ReviewCounter;
