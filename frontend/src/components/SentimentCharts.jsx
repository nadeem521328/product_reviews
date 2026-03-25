import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const SentimentCharts = ({ summary }) => {
  const theme = useTheme();
  const data = [
    { name: 'Positive', value: summary?.positive || 0 },
    { name: 'Neutral', value: summary?.neutral || 0 },
    { name: 'Negative', value: summary?.negative || 0 },
  ];

  const COLORS = [
    theme.palette.sentiment.positive,
    theme.palette.sentiment.neutral,
    theme.palette.sentiment.negative,
  ];

  return (
    <Card sx={{ height: 300 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
          Sentiment Distribution
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, height: 200 }}>
          <ResponsiveContainer width="48%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="48%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
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
