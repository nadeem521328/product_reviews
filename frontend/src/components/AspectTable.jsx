import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AspectTable = ({ aspectBreakdown }) => {
  const getStatus = (positive, negative) => {
    if (positive > negative) return 'Mostly Positive';
    if (negative > positive) return 'Mostly Negative';
    return 'Mixed';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Aspect-wise Sentiment
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Aspect</TableCell>
                <TableCell align="right">Positive</TableCell>
                <TableCell align="right">Negative</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(aspectBreakdown).map(([aspect, counts]) => (
                <TableRow key={aspect}>
                  <TableCell component="th" scope="row">
                    {aspect.charAt(0).toUpperCase() + aspect.slice(1)}
                  </TableCell>
                  <TableCell align="right">{counts.positive}</TableCell>
                  <TableCell align="right">{counts.negative}</TableCell>
                  <TableCell>{getStatus(counts.positive, counts.negative)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AspectTable;
