import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const SentimentCharts = ({ summary }) => {
  const theme = useTheme();
  const data = [
    { name: 'Positive', value: summary?.positive || 0 },
    { name: 'Neutral', value: summary?.neutral || 0 },
    { name: 'Negative', value: summary?.negative || 0 },
  ];

  const colors = [
    theme.palette.sentiment.positive,
    theme.palette.sentiment.neutral,
    theme.palette.sentiment.negative,
  ];

  return (
    <Card sx={{ borderRadius: '18px' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Sentiment distribution
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          A quick comparison of the balance across positive, neutral, and negative reviews.
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, height: { xs: 520, md: 320 }, flexDirection: { xs: 'column', md: 'row' } }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={88} dataKey="value" nameKey="name">
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis allowDecimals={false} stroke={theme.palette.text.secondary} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`${entry.name}-bar`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SentimentCharts;
