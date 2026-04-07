import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { fetchHistory } from '../services/api';
import * as XLSX from 'xlsx';

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return value;
  }
};

const getSentimentColor = (sentiment) => {
  if (sentiment === 'positive') return 'success';
  if (sentiment === 'negative') return 'error';
  return 'warning';
};

const sanitizeFilePart = (value) => String(value ?? '').replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-');

const calculateStarRating = (sentiment, confidence) => {
  const numericConfidence = Number(confidence ?? 0.5);
  if (sentiment === 'positive') {
    if (numericConfidence >= 0.8) return 5;
    if (numericConfidence >= 0.5) return 4;
    return 3;
  }
  if (sentiment === 'neutral') {
    return 3;
  }
  if (sentiment === 'negative') {
    return numericConfidence < 0.5 ? 2 : 1;
  }
  return 3;
};

const getStarDisplay = (stars) => '★'.repeat(stars) + '☆'.repeat(5 - stars);

const exportEntryToExcel = (entry, entryIndex) => {
  const exportRows = (entry.reviews || []).map((review, reviewIndex) => ({
    'Review Number': review.review_number || reviewIndex + 1,
    'Review Text': review.text,
    Sentiment: review.sentiment,
    Confidence: Number(review.confidence ?? 0),
    'Star Rating': getStarDisplay(calculateStarRating(review.sentiment, review.confidence)),
    'Saved At': entry.created_at,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Entry ${entryIndex + 1}`);
  XLSX.writeFile(workbook, `history-entry-${entryIndex + 1}-${sanitizeFilePart(entry.created_at)}.xlsx`);
};

const History = () => {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        setHistoryEntries(data.history || []);
      } catch (err) {
        setError('Unable to load history right now.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const totalReviews = historyEntries.reduce((sum, entry) => sum + (entry.reviews || []).length, 0);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label="History" color="secondary" />
          <Chip
            label={`${historyEntries.length} saved entr${historyEntries.length === 1 ? 'y' : 'ies'}`}
            variant="outlined"
          />
          <Chip label={`${totalReviews} review${totalReviews === 1 ? '' : 's'}`} variant="outlined" />
        </Stack>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Review history
        </Typography>
        <Typography color="text.secondary">
          Each saved analysis entry is shown separately with the reviews and sentiments inside it.
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ minHeight: 240, display: 'grid', placeItems: 'center' }}>
          <CircularProgress color="secondary" />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && historyEntries.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No history yet. Analyze a review batch once and it will appear here.
        </Alert>
      )}

      <Stack spacing={3}>
        {!loading &&
          !error &&
          historyEntries.map((entry, entryIndex) => (
            <Card key={entry.id} sx={{ borderRadius: '18px' }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                    mb: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                    <Chip label={`Entry ${entryIndex + 1}`} color="primary" variant="outlined" />
                    <Chip label={entry.sentiment} color={getSentimentColor(entry.sentiment)} variant="outlined" />
                    <Chip label={formatDate(entry.created_at)} variant="outlined" />
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadRoundedIcon />}
                    onClick={() => exportEntryToExcel(entry, entryIndex)}
                  >
                    Export
                  </Button>
                </Box>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Review feed
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  A readable list of the analyzed reviews and the sentiment assigned to each one.
                </Typography>
                <List sx={{ p: 0 }}>
                  {(entry.reviews || []).map((review, reviewIndex) => (
                    <React.Fragment key={`${entry.id}-${reviewIndex}`}>
                      <ListItem sx={{ px: 0, py: 2.5, alignItems: 'flex-start' }}>
                        <Box sx={{ width: '100%' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: 2,
                              mb: 1.5,
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              Review {review.review_number || reviewIndex + 1}
                            </Typography>
                            <Chip
                              label={review.sentiment}
                              color={getSentimentColor(review.sentiment)}
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            {review.text}
                          </Typography>
                        </Box>
                      </ListItem>
                      {reviewIndex < (entry.reviews || []).length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
      </Stack>
    </Container>
  );
};

export default History;
