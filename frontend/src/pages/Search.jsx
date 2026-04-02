import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Input,
  Tabs,
  Tab,
  Card,
  Grid,
  Stack,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api, { analyzeReview } from '../services/api';
import ReviewCounter from '../components/ReviewCounter';

const inputLabels = ['Manual text', 'TXT file', 'CSV file'];

const Search = () => {
  const [reviewText, setReviewText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvSelectedFile, setCsvSelectedFile] = useState(null);
  const [extractLoading, setExtractLoading] = useState(false);
  const [inputTooLarge, setInputTooLarge] = useState(false);
  const [inputMode, setInputMode] = useState(0);
  const [fileError, setFileError] = useState('');
  const [csvError, setCsvError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const updateReviewText = (value) => {
    setReviewText(value);
    const byteLength = new TextEncoder().encode(value).length;
    setInputTooLarge(byteLength > 50000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      setFileError('Please select a .txt file.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setFileError('File size too large. Maximum 100MB.');
      setSelectedFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateReviewText(event.target.result);
      setFileError('');
    };
    reader.onerror = () => {
      setFileError('Error reading file.');
    };
    reader.readAsText(file);
    setSelectedFile(file);
  };

  const handleCsvToText = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvError('Please select a .csv file.');
      setCsvSelectedFile(null);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setCsvError('File size too large. Maximum 100MB.');
      setCsvSelectedFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvContent = event.target.result;
        const lines = csvContent.split('\n').filter((line) => line.trim());
        if (lines.length === 0) {
          setCsvError('CSV file is empty.');
          return;
        }

        const header = lines[0].split(',').map((entry) => entry.trim().replace(/"/g, ''));
        const reviewColIndex = header.findIndex((col) => col.trim().toLowerCase() === 'reviews.text');
        if (reviewColIndex === -1) {
          setCsvError(`CSV must contain a "reviews.text" column. Found: ${header.join(', ')}`);
          return;
        }

        const reviews = [];
        for (let i = 1; i < lines.length; i += 1) {
          const cols = [];
          let col = '';
          let inQuote = false;
          for (let j = 0; j < lines[i].length; j += 1) {
            const char = lines[i][j];
            if (char === '"') {
              inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
              cols.push(col.trim());
              col = '';
            } else {
              col += char;
            }
          }
          cols.push(col.trim());

          if (cols[reviewColIndex] && cols[reviewColIndex].trim()) {
            reviews.push(cols[reviewColIndex].replace(/"/g, ''));
          }
        }

        if (!reviews.length) {
          setCsvError('No reviews found in CSV. Check column names.');
          return;
        }

        updateReviewText(reviews.join('\n'));
        setInputMode(2);
        setCsvError('');
        setCsvSelectedFile(file);
      } catch (err) {
        setCsvError(`Error parsing CSV: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setCsvError('Error reading CSV file.');
    };
    reader.readAsText(file);
  };

  const handleRawDataExtract = () => {
    const raw = reviewText.trim();
    if (!raw) {
      setError('Please enter raw data first.');
      return;
    }

    const reviews = [];
    const verifiedRegex = /Verified Purchase\s*\n([\s\S]*?)(?=Customer image|Helpful|Report|\n[A-Za-z][\w\s]+?\n\d+\.\d+\s+out of 5 stars|$)/gi;
    let match;

    while ((match = verifiedRegex.exec(raw)) !== null) {
      const text = match[1]
        .replace(/\n\s*\n+/g, ' ')
        .replace(/\b(Flavour Name:|Size:|Pack of|Reviewed in|Verified Purchase)\b/gi, '')
        .replace(/Customer image|Helpful|Report/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (text.length > 10 && !text.match(/^Flavour\s*Name/i)) {
        reviews.push(text);
      }
    }

    if (!reviews.length) {
      const ratingRegex = /\d+\.\d+\s+out of 5 stars[\s\S]*?(?=\n[A-Za-z][\w\s]+?\n\d+\.\d+\s+out of 5 stars|$)/gi;
      while ((match = ratingRegex.exec(raw)) !== null) {
        const candidate = match[0]
          .replace(/\d+\.\d+\s+out of 5 stars/gi, '')
          .replace(/\n\s*\n+/g, ' ')
          .replace(/(Customer image|Helpful|Report|Flavour Name:|Size:)/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (candidate.length > 10) {
          reviews.push(candidate);
        }
      }
    }

    if (!reviews.length) {
      let fallback = raw
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 15 && !paragraph.toLowerCase().includes('out of 5 stars'));

      if (!fallback.length) {
        fallback = raw
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 15 && !line.toLowerCase().includes('out of 5 stars'));
      }

      if (fallback.length) {
        reviews.push(...fallback.slice(0, 20));
      }
    }

    updateReviewText(reviews.length ? reviews.join('\n\n') : raw);
    setError(reviews.length ? `Extracted ${reviews.length} clean review(s).` : 'No structured reviews found. Raw text was kept.');
  };

  const handleCsvDirectAnalyze = async () => {
    if (!csvSelectedFile) {
      setCsvError('No CSV file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', csvSelectedFile);

    setLoading(true);
    setCsvError('');
    try {
      const { data } = await api.post('/analyze-csv', formData);
      navigate('/dashboard', { state: { data } });
    } catch (err) {
      setCsvError(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError('Please enter review text.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await analyzeReview(reviewText);
      navigate('/dashboard', { state: { data } });
    } catch (err) {
      setError('Error analyzing review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reviewLines = reviewText.split('\n').filter((line) => line.trim()).length;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3.5, borderRadius: '18px', height: '100%' }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Chip label="Analyzer" color="secondary" />
              <Chip label={inputLabels[inputMode]} variant="outlined" />
            </Stack>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Turn raw reviews into a clean sentiment report.
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Choose how you want to bring reviews in, clean them if needed, then move straight into the dashboard.
            </Typography>
            <Stack spacing={2}>
              {[
                'Manual input for quick tests and demos',
                'TXT upload when you already have cleaned review lines',
                'CSV support for review datasets using the reviews.text column',
              ].map((item) => (
                <Box
                  key={item}
                  sx={{
                    p: 2,
                    borderRadius: '18px',
                    backgroundColor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
                    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.05)',
                    '@media (hover: hover)': {
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 18px 36px rgba(15, 23, 42, 0.10)',
                        borderColor: 'rgba(31, 78, 87, 0.18)',
                      },
                    },
                  }}
                >
                  <Typography variant="body2">{item}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: '18px' }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Review workspace
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Load reviews, clean them, and send them to the existing backend analyzer without changing its logic.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Tabs
                value={inputMode}
                onChange={(_, newValue) => setInputMode(newValue)}
                variant="fullWidth"
                sx={{ mb: 3 }}
              >
                <Tab label="Manual text" />
                <Tab label="TXT file" />
                <Tab label="CSV file" />
              </Tabs>

              <TextField
                fullWidth
                multiline
                rows={16}
                label="Review input area"
                value={reviewText}
                onChange={(e) => updateReviewText(e.target.value)}
                required
                disabled={inputTooLarge}
                helperText="Paste Amazon raw data or cleaned review lines here."
              />

              <ReviewCounter reviewText={reviewText} />

              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }} useFlexGap>
                <Chip label={`Review lines: ${reviewLines}`} color="primary" variant="outlined" />
                <Chip
                  label={`Input size: ${(new TextEncoder().encode(reviewText).length / 1000).toFixed(1)} KB`}
                  color="secondary"
                  variant="outlined"
                />
              </Stack>

              {inputTooLarge && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Input is too large. The current limit is 50KB. Trim the text or use CSV mode.
                </Alert>
              )}

              {inputMode === 1 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Upload a TXT file
                  </Typography>
                  <Input type="file" accept=".txt" onChange={handleFileUpload} />
                  {selectedFile && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loaded file: {selectedFile.name}
                    </Typography>
                  )}
                  {fileError && <Alert severity="error" sx={{ mt: 2 }}>{fileError}</Alert>}
                </Box>
              )}

              {inputMode === 2 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Upload a CSV file
                  </Typography>
                  <Input type="file" accept=".csv" onChange={handleCsvToText} />
                  {csvSelectedFile && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loaded file: {csvSelectedFile.name}
                    </Typography>
                  )}
                  {csvError && <Alert severity="error" sx={{ mt: 2 }}>{csvError}</Alert>}
                  {csvSelectedFile && (
                    <Button sx={{ mt: 2 }} variant="outlined" onClick={handleCsvDirectAnalyze} disabled={loading}>
                      Direct analyze CSV
                    </Button>
                  )}
                </Box>
              )}

              {error && (
                <Alert severity={error.startsWith('Extracted') ? 'success' : 'error'} sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button
                  onClick={handleRawDataExtract}
                  variant="outlined"
                  size="large"
                  disabled={extractLoading || !reviewText.trim() || inputTooLarge}
                >
                  Extract from raw text
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={loading || inputTooLarge}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Analyzing...' : 'Analyze reviews'}
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
