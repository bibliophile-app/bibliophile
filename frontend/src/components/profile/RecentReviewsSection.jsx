import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import Divider from '@/atoms/Divider';
import ReviewCard from '../reviews/ReviewCard';

function RecentReviewsSection({ reviews, user }) {
  const navigate = useNavigate();
  // Mostra até 4 reviews recentes
  const recentReviews = reviews.filter(r => r.content).slice(0, 4);

  const handleNavigate = () => {
    if (user?.username) {
      navigate(`/${user.username}/reviews`);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 1 }}>
        <Typography
          variant="p"
          sx={{ color: 'neutral.secondary', textTransform: 'uppercase' }}
        >
          Avaliações Recentes
        </Typography>
        <Button
          onClick={handleNavigate}
          variant="text"
          sx={{ color: 'neutral.main', fontWeight: 400, fontSize: '0.80rem', textTransform: 'none', p: 0, minWidth: 'unset' }}
        >
          mais
        </Button>
      </Box>
      <Divider sx={{ borderColor: '#334355', mb: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {recentReviews.length > 0 ? (
          recentReviews.map((review, index) => (
            <React.Fragment key={review.id}>
              {index !== 0 && <Divider sx={{ opacity: 0.5, my: 1 }} />}
              <ReviewCard
                review={review}
                displayDate={true}
                displayOwner={false}
                displayContent={true}
                displayBookDetails={true}
              />
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: '#aaa', px: 1, py: 2 }}>
            Nenhuma review recente encontrada.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RecentReviewsSection;