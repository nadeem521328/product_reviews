import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  Stack,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const highlights = [
  'Paste or upload review data in seconds',
  'Clean review extraction from raw marketplace text',
  'Understand positive, neutral, and negative patterns',
  'Turn review text into charts, ratings, and insights',
  'Explore aspect-based feedback across key product themes',
  'Review individual sentiment analysis for each customer response',
];

const metrics = [
  { value: '3', label: 'input modes' },
  { value: '1', label: 'analysis flow' },
  { value: '360°', label: 'review visibility' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              position: 'relative',
              isolation: 'isolate',
              p: { xs: 3, md: 5 },
              minHeight: '100%',
              borderRadius: '18px',
              border: '1px solid',
              borderColor: 'rgba(185, 152, 90, 0.16)',
              background: 'linear-gradient(145deg, rgba(36,29,40,0.98), rgba(49,39,54,0.92))',
              color: '#FAF7F2',
              transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: { xs: '-18px', md: '-28px' },
                borderRadius: '32px',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'radial-gradient(circle at 55% 0%, rgba(162,138,168,0.24) 0%, rgba(198,164,106,0.18) 40%, rgba(198,164,106,0) 74%)'
                    : 'radial-gradient(circle at 55% 0%, rgba(69,53,75,0.24) 0%, rgba(185,152,90,0.16) 40%, rgba(185,152,90,0) 74%)',
                filter: 'blur(30px)',
                zIndex: -1,
                pointerEvents: 'none',
              },
              '@media (hover: hover)': {
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 30px 70px rgba(12, 10, 16, 0.40)',
                  borderColor: 'rgba(185, 152, 90, 0.24)',
                },
              },
            }}
          >
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Chip label="Product Reviews" color="secondary" />
              <Chip label="Sentiment Dashboard" variant="outlined" />
            </Stack>
            <Typography variant="h2" component="h1" sx={{ mb: 2 }}>
              Make your review analyzer feel like a real product.
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 680, mb: 4, color: 'rgba(212, 200, 210, 0.88)' }}>
              Your app takes raw customer feedback and turns it into readable sentiment signals, ratings,
              and actionable summaries for product analysis.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
              <Button size="large" variant="contained" color="secondary" onClick={() => navigate('/search')}>
                Start analyzing
              </Button>
              <Button size="large" variant="outlined" onClick={() => navigate('/dashboard')}>
                Open dashboard
              </Button>
            </Stack>
            <Grid container spacing={2}>
              {metrics.map((metric) => (
                <Grid item xs={12} sm={4} key={metric.label}>
                  <Card
                    sx={{
                      p: 2.5,
                      height: '100%',
                      borderRadius: '18px',
                      background: 'linear-gradient(160deg, rgba(33,26,36,0.98), rgba(47,37,52,0.94))',
                      color: '#FAF7F2',
                      borderColor: 'rgba(185, 152, 90, 0.14)',
                    }}
                  >
                    <Typography variant="h3" sx={{ color: '#D1B486' }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(212, 200, 210, 0.84)' }}>
                      {metric.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            sx={{
              position: 'relative',
              isolation: 'isolate',
              p: { xs: 3, md: 4 },
              borderRadius: '18px',
              height: '100%',
              background: 'linear-gradient(160deg, rgba(36,29,40,0.98), rgba(49,39,54,0.92))',
              color: '#FAF7F2',
              borderColor: 'rgba(185, 152, 90, 0.16)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: { xs: '-16px', md: '-22px' },
                borderRadius: '28px',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'radial-gradient(circle at 50% 10%, rgba(162,138,168,0.22) 0%, rgba(198,164,106,0.18) 38%, rgba(198,164,106,0) 72%)'
                    : 'radial-gradient(circle at 50% 10%, rgba(69,53,75,0.24) 0%, rgba(185,152,90,0.16) 38%, rgba(185,152,90,0) 72%)',
                filter: 'blur(24px)',
                zIndex: -1,
                pointerEvents: 'none',
              },
            }}
          >
            <Typography variant="h5" sx={{ mb: 3 }}>
              What this website now communicates
            </Typography>
            <Stack spacing={2.5}>
              {highlights.map((item) => (
                <Box
                  key={item}
                  sx={{
                    p: 2.5,
                    borderRadius: '18px',
                    background: 'linear-gradient(160deg, rgba(250,247,242,0.06), rgba(185,152,90,0.04))',
                    border: '1px solid',
                    borderColor: 'rgba(250, 247, 242, 0.08)',
                    transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
                    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.05)',
                    '@media (hover: hover)': {
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 18px 36px rgba(12, 10, 16, 0.28)',
                        borderColor: 'rgba(185, 152, 90, 0.18)',
                      },
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ color: '#FAF7F2' }}>{item}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
