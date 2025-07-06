import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import LoadingBox from '@/atoms/LoadingBox';
import { useAuth } from '../utils/AuthContext';
import { searchByUser as searchReviewsByUser } from '../utils/reviews';
import { searchByUser as searchListsByUser } from '../utils/lists';
import QuotesSection from '../components/quotes/QuotesSection';
import NavProfile from '@/components/navigation/NavProfile';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import RecentReviewsSection from '../components/profile/RecentReviewsSection';

const fetchQuotesByUser = async (username) => {
  // Busca quotes do usuário correto pelo endpoint /quotes/user/{username}
  const response = await fetch(`/quotes/user/${username}`, { credentials: 'include' });
  if (!response.ok) return [];
  return await response.json();
};

function UserProfilePage() {
  const { username } = useParams();
  const { user: loggedUser } = useAuth();
  const [user, setUser] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        // Decide usuário
        const currentUser = username === loggedUser?.username ? loggedUser : { username, name: username, metrics: { booksRated: 0, lists: 0, following: 0, followers: 0 } };
        // Busca reviews, quotes e listas reais
        const [userReviews, userQuotes, userLists] = await Promise.all([
          searchReviewsByUser(username),
          fetchQuotesByUser(username),
          searchListsByUser(username)
        ]);
        // Calcula livros únicos
        const uniqueBooks = new Set(userReviews.map(r => r.bookId)).size;
        // Followers/following: se vierem do backend, use, senão mantenha 0
        const metrics = {
          booksRated: uniqueBooks,
          lists: userLists.length,
          following: currentUser.metrics?.following ?? 0,
          followers: currentUser.metrics?.followers ?? 0,
        };
        if (isMounted) {
          setUser({ ...currentUser, metrics });
          setReviews(userReviews);
          setQuotes(userQuotes);
          setLists(userLists);
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
    return <LoadingBox />;
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <UserProfileHeader user={user} />
      <NavProfile username={user.username} hiddenUser />
      <QuotesSection quotes={quotes} user={user} />
      <RecentReviewsSection reviews={reviews} user={user} />
    </Box>
  );
};

export default UserProfilePage;