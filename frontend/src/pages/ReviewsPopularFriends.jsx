import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Divider from '@/atoms/Divider';
import LoadingBox from '@/atoms/LoadingBox';
import ReviewCard from '@/components/reviews/ReviewCard';
import { fetchPopularFriendsReviews } from '@/utils/reviews';
import { useNotification } from '@/utils/NotificationContext';

function ReviewsPopularFriends() {
  const { notify } = useNotification();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchReviews = async () => {
      try {
        const reviews = await fetchPopularFriendsReviews();
        setEntries(reviews);
        setLoading(false);
      } catch (error) {
        notify({
          message: 'Erro ao carregar reviews populares dos amigos!',
          severity: 'error',
        });
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <LoadingBox />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="p"
        sx={{ color: 'neutral.secondary', textTransform: 'uppercase' }}
      >
        ATIVIDADES DE AMIGOS
      </Typography>
      <Divider sx={{ borderColor: '#334355', my: 1 }} />
      
      {entries && entries.length > 0 ? (
        entries
          .filter(e => e.content)
          .map((entry, index) => (
            <React.Fragment key={entry.id}>
              {index !== 0 && <Divider sx={{ opacity: 0.5, my: 1 }} />}
              <ReviewCard
                review={entry}
                displayDate={true}
                displayOwner={true}
                displayContent={true}
                displayBookDetails={true}
              />
            </React.Fragment>
          ))
      ) : (
        <Typography variant="p" sx={{ mb: 2 }}>
          Parece que ainda não há reviews populares dos amigos...
        </Typography>
      )}
    </Box>
  );
}

export default ReviewsPopularFriends;
