import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ListSection from '../ListSection';

const PopularFriendsReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPopularFriendsReviews() {
      setLoading(true);
      try {
        // Busca reviews populares dos amigos do usuário logado
        const response = await fetch('/reviews/popular/friends');
        const data = await response.json();
        setReviews(data);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    getPopularFriendsReviews();
  }, []);

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 5, mb: 4 }}>
      <ListSection
        pathTo="/popular/friends"
        title="ATIVIDADES DE AMIGOS"
        items={reviews}
        type="reviews"
      />
    </Box>
  );
};

export default PopularFriendsReviewsSection;
