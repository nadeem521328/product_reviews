import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CustomersSay = ({ customersSay }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Customers Say
        </Typography>
        <Typography variant="body1" paragraph>
          {customersSay}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          This summary is automatically generated and may not be 100% accurate.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CustomersSay;
