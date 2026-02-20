import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const OverallSentiment = ({ data }) => {
  // Use summary data which correctly counts all individual reviews
  const summary = data.summary || {};
  const totalPositive = summary.positive || 0;
  const totalNeutral = summary.neutral || 0;
  const totalNegative = summary.negative || 0;
  const totalReviews = summary.total_reviews || 0;

  const getOverallSentiment = () => {
    if (totalPositive > totalNegative && totalPositive > totalNeutral) return 'Mostly Positive';
    if (totalNegative > totalPositive && totalNegative > totalNeutral) return 'Mostly Negative';
    if (totalNeutral > totalPositive && totalNeutral > totalNegative) return 'Mostly Neutral';
    return 'Mixed';
  };

  const getSentimentColor = () => {
    const sentiment = getOverallSentiment();
    if (sentiment === 'Mostly Positive') return 'green';
    if (sentiment === 'Mostly Negative') return 'red';
    if (sentiment === 'Mostly Neutral') return 'orange';
    return 'gray';
  };

  return (
    <Card sx={{ minHeight: 140 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Overall Sentiment
        </Typography>
        <Typography variant="h4" color={getSentimentColor()}>
          {getOverallSentiment()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Based on {totalReviews} reviews analyzed
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          👍 {totalPositive} | 😐 {totalNeutral} | 👎 {totalNegative}
        </Typography>
        
        {data.star_rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1, gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              {data.star_rating.average_rating}
            </Typography>
            <Typography variant="h6">
              {data.star_rating.display}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OverallSentiment;
