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
    if (sentiment === 'Mostly Positive') return 'sentiment.positive';
    if (sentiment === 'Mostly Negative') return 'sentiment.negative';
    if (sentiment === 'Mostly Neutral') return 'sentiment.neutral';
    return 'sentiment.mixed';
  };

  const SentimentIcon = ({ sentiment }) => {
    if (sentiment === 'Mostly Positive') return '😊';
    if (sentiment === 'Mostly Negative') return '😞';
    if (sentiment === 'Mostly Neutral') return '😐';
    return '🤔';
  };

  return (
    <Card sx={{ 
      minHeight: 200, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Overall Sentiment
        </Typography>
        <Box sx={{ fontSize: 64, mb: 2 }}>
          <SentimentIcon sentiment={getOverallSentiment()} />
        </Box>
        <Typography variant="h3" color={getSentimentColor()} gutterBottom sx={{ fontWeight: 800 }}>
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
