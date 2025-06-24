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
      <Typography variant="h4" sx={{ fontWeight: 400, color: 'neutral.main', fontFamily: 'Inter, Helvetica Neue, sans-serif', fontSize: '1rem', textTransform: 'none', letterSpacing: 0 }}>
        ATIVIDADES DE AMIGOS
        </Typography>
        <Divider sx={{ borderColor: '#334355', mb: 2 }} />
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
