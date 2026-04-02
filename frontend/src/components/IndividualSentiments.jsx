import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

const IndividualSentiments = ({ individualSentiments }) => {
  return (
    <Card sx={{ borderRadius: '18px' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Individual sentiment analysis ({individualSentiments.length} reviews)
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 640, overflow: 'auto', borderRadius: '12px' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Review text</TableCell>
                <TableCell>Sentiment</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {individualSentiments.map((result) => (
                <TableRow key={result.review_number} hover>
                  <TableCell>{result.review_number}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', maxWidth: 460 }}>
                      {result.text}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={result.sentiment}
                      color={
                        result.sentiment === 'positive'
                          ? 'success'
                          : result.sentiment === 'negative'
                            ? 'error'
                            : 'warning'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{(parseFloat(result.confidence) * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {Array.from({ length: result.star_rating || 0 }).map((_, index) => (
                        <StarRoundedIcon key={index} sx={{ color: 'secondary.main', fontSize: 20 }} />
                      ))}
                    </Box>
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
