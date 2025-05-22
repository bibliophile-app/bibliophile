import { Box, Typography, Avatar, Stack } from '@mui/material';

import Rating from '../../atoms/Rating';
import Favorite from '../../atoms/Favorite';

const ReviewCard = ({ review }) => {
  const { username, content, rate, favorite, reviewedAt } = review;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        boxShadow: 1,
      }}
    >
      {/* Avatar */}
      <Avatar>
        {username.charAt(0).toUpperCase()}
      </Avatar>

      {/* Conteúdo */}
      <Box sx={{ flex: 1 }}>
        {/* Header: nome + rating + favorito */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Review by
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {username}
          </Typography>

          {/* Rating e Favorite */}
          <Rating value={rate / 2} readOnly size="small" />
          <Favorite active={favorite} />
        </Stack>

        {/* Conteúdo do review */}
        <Typography variant="body1" sx={{ mt: 1 }}>
          {content}
        </Typography>

        {/* Data */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {new Date(reviewedAt + 'T00:00:00').toDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default ReviewCard;
