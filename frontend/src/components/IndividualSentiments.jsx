import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const IndividualSentiments = ({ individualSentiments }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Individual Sentiment Analysis
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Review Number</TableCell>
                <TableCell>Text</TableCell>
                <TableCell>Sentiment</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Star Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {individualSentiments.map((result) => (
                <TableRow key={result.review_number}>
                  <TableCell>{result.review_number}</TableCell>
                  <TableCell>{result.text}</TableCell>
                  <TableCell>{result.sentiment}</TableCell>
                  <TableCell>{result.confidence}</TableCell>
                  <TableCell>
                    {result.star_display || '⭐'.repeat(result.star_rating || 0) + '☆'.repeat(5 - (result.star_rating || 0))}
                  </TableCell>
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
