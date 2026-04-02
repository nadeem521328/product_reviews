import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const TotalReviews = ({ reviews, summary }) => {
  const totalReviews = summary ? summary.total_reviews : reviews?.length || 0;
  const positive = summary?.positive || 0;
  const neutral = summary?.neutral || 0;
  const negative = summary?.negative || 0;

  const stats = [
    { label: 'Positive', value: positive, color: 'sentiment.positive' },
    { label: 'Neutral', value: neutral, color: 'sentiment.neutral' },
    { label: 'Negative', value: negative, color: 'sentiment.negative' },
  ];

  return (
    <Card sx={{ borderRadius: '18px', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Review volume
        </Typography>
        <Typography variant="h3" sx={{ mb: 3 }}>
          {totalReviews}
        </Typography>
        <Grid container spacing={2}>
          {stats.map((item) => (
            <Grid item xs={12} sm={4} key={item.label}>
              <Box sx={{ p: 2, borderRadius: 4, backgroundColor: 'background.default' }}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ color: item.color, mt: 0.5 }}>
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalReviews;
