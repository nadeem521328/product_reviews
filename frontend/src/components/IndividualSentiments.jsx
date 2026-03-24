import React from 'react';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const IndividualSentiments = ({ individualSentiments }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Individual Sentiment Analysis
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Review #</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Text (truncated)</TableCell>
                <TableCell>Sentiment</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Stars</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {individualSentiments.slice(0, 10).map((result) => ( // Limit to 10 for better perf
                <TableRow key={result.review_number} hover>
                  <TableCell>{result.review_number}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={result.text}>
                      {result.text.length > 50 ? `${result.text.slice(0, 50)}...` : result.text}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'semiBold' }}>
                    <Box sx={{ 
                      px: 2, py: 0.5, borderRadius: 2, 
                      bgcolor: result.sentiment === 'positive' ? 'sentiment.positive.main' : 
                               result.sentiment === 'negative' ? 'sentiment.negative.main' : 'sentiment.neutral.main',
                      color: 'black',
                      fontSize: '0.875rem'
                    }}>
                      {result.sentiment}
                    </Box>
                  </TableCell>
                  <TableCell>{(parseFloat(result.confidence) * 100).toFixed(1)}%</TableCell>
                  <TableCell>{result.star_display || '⭐'.repeat(result.star_rating || 0) + '☆'.repeat(5 - (result.star_rating || 0))}</TableCell>
                </TableRow>
              ))}
              {individualSentiments.length > 10 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ p: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Showing first 10 of {individualSentiments.length} reviews
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default IndividualSentiments;
