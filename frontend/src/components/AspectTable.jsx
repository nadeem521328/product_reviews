import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

const AspectTable = ({ aspectBreakdown }) => {
  const getStatus = (positive, negative, neutral) => {
    if (positive > negative && positive >= neutral) return { label: 'Mostly Positive', color: 'success' };
    if (negative > positive && negative >= neutral) return { label: 'Mostly Negative', color: 'error' };
    if (neutral > positive && neutral >= negative) return { label: 'Mostly Neutral', color: 'warning' };
    return { label: 'Mixed', color: 'info' };
  };

  return (
    <Card sx={{ borderRadius: '18px' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Aspect breakdown
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          See how sentiment shifts across the different product aspects detected in the review set.
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Aspect</TableCell>
                <TableCell align="right">Positive</TableCell>
                <TableCell align="right">Neutral</TableCell>
                <TableCell align="right">Negative</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(aspectBreakdown || {}).map(([aspect, counts]) => {
                const status = getStatus(counts.positive || 0, counts.negative || 0, counts.neutral || 0);
                return (
                  <TableRow key={aspect} hover>
                    <TableCell>{aspect.charAt(0).toUpperCase() + aspect.slice(1)}</TableCell>
                    <TableCell align="right">{counts.positive || 0}</TableCell>
                    <TableCell align="right">{counts.neutral || 0}</TableCell>
                    <TableCell align="right">{counts.negative || 0}</TableCell>
                    <TableCell>
                      <Chip label={status.label} color={status.color} variant="outlined" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AspectTable;
