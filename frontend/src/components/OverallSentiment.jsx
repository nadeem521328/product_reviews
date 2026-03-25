import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box } from '@mui/material';

const OverallSentiment = ({ data }) => {
  const theme = useTheme();
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

  const SentimentIcon = ({ sentiment }) => {
    if (sentiment === 'Mostly Positive') return '😊';
    if (sentiment === 'Mostly Negative') return '😞';
    if (sentiment === 'Mostly Neutral') return '😐';
    return '🤔';
  };

  const gradientBg = theme.palette.mode === 'light' 
    ? 'linear-gradient(135deg, #F5F5DC 0%, #FDF6E3 100%)' 
    : 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)';

  return (
    <Card sx={{ 
      minHeight: 200, 
      background: gradientBg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
          Overall Sentiment
        </Typography>
        <Box sx={{ fontSize: 64, mb: 2 }}>
          <SentimentIcon sentiment={getOverallSentiment()} />
        </Box>
        <Typography variant="h3" color={getSentimentColor(getOverallSentiment())} gutterBottom sx={{ fontWeight: 800 }}>
          {getOverallSentiment()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Based on {totalReviews} reviews analyzed
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          👍 {totalPositive} | 😐 {totalNeutral} | 👎 {totalNegative}
        </Typography>
        
      </CardContent>
    </Card>
  );
};

export default OverallSentiment;
