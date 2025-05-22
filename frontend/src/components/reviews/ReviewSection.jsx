import { Box, Typography, Stack } from '@mui/material';
import ReviewCard from './ReviewCard';

import Divider from '../../atoms/Divider';

const ReviewSection = ({ reviews, title  }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {reviews.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No reviews yet!
        </Typography>
      ) : (
        <Stack spacing={2}>
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ReviewSection;
