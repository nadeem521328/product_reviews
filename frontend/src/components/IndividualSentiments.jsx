import React from 'react';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const IndividualSentiments = ({ individualSentiments }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Individual Sentiment Analysis ({individualSentiments.length} reviews)
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ fontWeight: 'bold' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>S.NO</TableCell>
                <TableCell sx={{ minWidth: 200, fontWeight: 'bold', fontSize: '1rem' }} align="left">Review Text</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Sentiment</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Confidence</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Star Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {individualSentiments.map((result) => (
                <TableRow key={result.review_number} hover>
                  <TableCell>{result.review_number}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', maxWidth: 400 }}>
                      {result.text}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'semiBold' }}>
                    <Box sx={{ 
                      px: 2, py: 0.5, borderRadius: 2, 
                      bgcolor: result.sentiment === 'positive' ? 'sentiment.positive.main' : 
                               result.sentiment === 'negative' ? 'sentiment.negative.main' : 'sentiment.neutral.main',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>
                      {result.sentiment}
                    </Box>
                  </TableCell>
                  <TableCell>{(parseFloat(result.confidence) * 100).toFixed(1)}%</TableCell>
                  <TableCell>{result.star_display || '⭐'.repeat(result.star_rating || 0) + '☆'.repeat(5 - (result.star_rating || 0))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default IndividualSentiments;

