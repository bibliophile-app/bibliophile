import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; 

import { useAuth } from '../../utils/AuthContext';
import { searchById } from './utils'; 
import useOpenLibrary from '../../utils/useOpenLibrary';

import Rating from '../../atoms/Rating';
import Favorite from '../../atoms/Favorite';
import ReviewForm from './ReviewForm';
import UserAvatar from '../../atoms/UserAvatar';

const ReviewCard = ({ review, displayDate = false }) => {
  const { user } = useAuth();
  const [currentReview, setCurrentReview] = useState(review);
  const [book, setBook] = useState(null);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  const { fetchResults } = useOpenLibrary({
    onResults: setBook,
    onError: null,
  });

  useEffect(() => {
    if (currentReview?.bookId) {
      fetchResults(null, currentReview.bookId);
    }
  }, [currentReview]);

  const handleOpen = () => {
    if (user?.username === currentReview.username) {
      setReviewFormOpen(true);
    }
  };

  const handleClose = () => {
    setReviewFormOpen(false);
  };

  const handleReviewUpdated = async () => {
    const updated = await searchById(currentReview.id); // buscar nova review da API
    setCurrentReview(updated);
  };

  if (!currentReview) return null;

  const { username, content, rate, favorite, reviewedAt } = currentReview;

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', gap: 1.5, p: 1, mb: 2 }} onClick={handleOpen}>
        <UserAvatar username={username} />

        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" sx={{ color: '#9da5b4' }}>
              Review by
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              component={RouterLink}
              to={`/profile/${username}`}
              onClick={(e) => e.stopPropagation()}
            >
              {username}
            </Typography>

            <Rating value={rate / 2} readOnly size="small" sx={{ color: '#00e676' }} precision={0.5}/>
            {favorite && <Favorite selected={true} sx={{ fontSize: '1rem', color: 'background.muted' }} />}
          </Stack>

          <Typography variant="body1" sx={{ mt: 1 }}>
            {content}
          </Typography>

          {displayDate && 
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#9da5b4' }}>
              {new Date(reviewedAt + 'T00:00:00').toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Typography>
          }
        </Box>
      </Box>

      <ReviewForm
        book={book}
        open={reviewFormOpen}
        onClose={handleClose}
        reviewId={currentReview.id}
        onSubmit={handleReviewUpdated}
      />
    </React.Fragment>
  );
};

export default ReviewCard;