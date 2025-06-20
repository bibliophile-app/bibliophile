import React, { useEffect, useState } from 'react';
import UserProfileHeader from '../components/UserProfileHeader/UserProfileHeader';
import NavigationTabs from '../components/NavigationTabs/NavigationTabs';
import QuotesSection from '../components/QuotesSection/QuotesSection';
import RecentReviewsSection from '../components/RecentReviewsSection/RecentReviewsSection';
import { useParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { searchByUser as searchReviewsByUser } from '../utils/reviews';
import { Box } from '@mui/material';

const fetchQuotesByUser = async (username) => {
  // Busca quotes do usuário pelo endpoint já existente
  const response = await fetch(`/quotes`, { credentials: 'include' });
  if (!response.ok) return [];
  return await response.json();
};

const UserProfilePage = () => {
  const { username } = useParams();
  const { user: loggedUser } = useAuth();
  const [user, setUser] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        // Decide usuário
        const currentUser = username === loggedUser?.username ? loggedUser : { username, name: username, metrics: { booksRated: 0, lists: 0, following: 0, followers: 0 } };
        // Busca reviews e quotes reais
        const [userReviews, userQuotes] = await Promise.all([
          searchReviewsByUser(username),
          fetchQuotesByUser(username)
        ]);
        if (isMounted) {
          setUser(currentUser);
          setReviews(userReviews);
          setQuotes(userQuotes);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [username, loggedUser]);

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', maxWidth: 900, width: '100%', margin: '0 auto', minHeight: '100vh', px: { xs: 2, sm: 3, md: 0 } }}>
        Carregando perfil...
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', maxWidth: 900, width: '100%', margin: '0 auto', minHeight: '100vh', px: { xs: 2, sm: 3, md: 0 } }}>
      <UserProfileHeader user={user} />
      <NavigationTabs user={user} />
      <QuotesSection quotes={quotes} user={user} />
      <RecentReviewsSection reviews={reviews} user={user} />
    </Box>
  );
};

export default UserProfilePage;