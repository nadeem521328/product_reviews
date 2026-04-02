import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
  Box,
  Chip,
} from '@mui/material';

const ReviewsList = ({ reviews }) => {
  return (
    <Card sx={{ borderRadius: '18px' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Review feed
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          A readable list of the analyzed reviews and the sentiment assigned to each one.
        </Typography>
        <List sx={{ p: 0 }}>
          {reviews.map((review, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ px: 0, py: 2.5, alignItems: 'flex-start' }}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Review {review.review_number || index + 1}
                    </Typography>
                    <Chip
                      label={review.sentiment}
                      color={
                        review.sentiment === 'positive'
                          ? 'success'
                          : review.sentiment === 'negative'
                            ? 'error'
                            : 'warning'
                      }
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {review.text}
                  </Typography>
                </Box>
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
