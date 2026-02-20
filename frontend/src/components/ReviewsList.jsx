import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const ReviewsList = ({ reviews }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Reviews
        </Typography>
        <List>
          {reviews.map((review, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={review.text} secondary={`Sentiment: ${review.sentiment}`} />
              </ListItem>
              {index < reviews.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ReviewsList;
