import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ListSection from '../ListSection';

function ActivityFriends() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function getPopularFriendsReviews() {
      try {
        // Busca reviews populares dos amigos do usuário logado
        const response = await fetch('/reviews/popular/friends');
        const data = await response.json();
        setReviews(data);
      } catch {
        setReviews([]);
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

export default ActivityFriends;
