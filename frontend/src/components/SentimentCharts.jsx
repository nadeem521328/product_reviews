import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SentimentCharts = ({ aspectBreakdown }) => {
  const pieData = [
    { name: 'Positive', value: Object.values(aspectBreakdown).reduce((sum, aspect) => sum + aspect.positive, 0) },
    { name: 'Negative', value: Object.values(aspectBreakdown).reduce((sum, aspect) => sum + aspect.negative, 0) },
  ];

  const barData = Object.entries(aspectBreakdown).map(([aspect, counts]) => ({
    aspect: aspect.charAt(0).toUpperCase() + aspect.slice(1),
    positive: counts.positive,
    negative: counts.negative,
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Visual Analytics
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="aspect" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="positive" fill="#8884d8" />
            <Bar dataKey="negative" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentCharts;
