import React from 'react';
import { Card, CardContent, Typography, LinearProgress } from '@mui/material';

const OverallSentiment = ({ data }) => {
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

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Mostly Positive') return 'sentiment.positive';
    if (sentiment === 'Mostly Negative') return 'sentiment.negative';
    if (sentiment === 'Mostly Neutral') return 'sentiment.neutral';
    return 'sentiment.mixed';
  };

  const ratio = totalReviews ? Math.max(totalPositive, totalNeutral, totalNegative) / totalReviews : 0;

  return (
    <Card
      sx={{
        minHeight: 280,
        borderRadius: '18px',
        background: 'linear-gradient(160deg, rgba(69,53,75,0.24), rgba(185,152,90,0.16))',
      }}
    >
      <CardContent sx={{ p: 3.5 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Overall sentiment
        </Typography>
        <Typography variant="h3" color={getSentimentColor(getOverallSentiment())} sx={{ mb: 1 }}>
          {getOverallSentiment()}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Based on {totalReviews} reviews analyzed in this batch.
        </Typography>

        <LinearProgress
          variant="determinate"
          value={Math.round(ratio * 100)}
          sx={{
            height: 10,
            borderRadius: 999,
            mb: 3,
            backgroundColor: 'rgba(250,247,242,0.20)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
            },
          }}
        />

        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          This section gives a quick reading of the overall sentiment trend in the selected batch. It helps you understand the dominant tone at a glance before moving into charts, aspect-level feedback, and detailed review analysis.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OverallSentiment;
