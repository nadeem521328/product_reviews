import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const CustomersSay = ({ customersSay }) => {
  return (
    <Card sx={{ borderRadius: '18px' }}>
      <CardContent sx={{ p: 3.5 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Customers say
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          AI-generated summary of the strongest feedback themes found in the review set.
        </Typography>
        <Box
          sx={{
            p: 3,
            borderRadius: 5,
            background: 'linear-gradient(135deg, rgba(18,52,59,0.10), rgba(184,116,68,0.10))',
          }}
        >
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 1 }}>
            {customersSay}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            This summary is automatically generated and should be treated as supportive guidance.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomersSay;
