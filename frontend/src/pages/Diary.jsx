import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Card, CardMedia, Typography, Rating, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useAuth } from '../utils/AuthContext';
import { searchByUser } from '../components/reviews/utils';
import useOpenLibrary  from '../utils/useOpenLibrary';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.purple.secondary,
  },
  '& .MuiRating-iconHover': {
    color: theme.palette.purple.main,
  },
}));

const StyledFavorite = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isFavorite',
})(({ isFavorite }) => ({
  padding: 0,
  color: isFavorite ? '#ff6d75' : 'rgba(255,255,255,0.3)',
  '&:hover': {
    color: '#ff3d47',
  },
  transition: 'color 0.2s',
}));

function DiaryEntryCard({ entry }) {
  const day = new Date(entry.reviewedAt).getDate();
  const year = new Date(entry.reviewedAt).getFullYear();
  const [book, setBook] = useState(null);
  
  const { fetchResults, loading } = useOpenLibrary({
    onResults: setBook,
    onError: null,
  });

  useEffect(() => {
    fetchResults(null, entry.bookId);
  }, [entry]);

  if (loading) return;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      {/* Dia em destaque */}
      <Box sx={{ width: 40, textAlign: 'center' }}>
        <Typography variant="h6">{day}</Typography>
      </Box>

      <Card sx={{ display: 'flex', alignItems: 'center', flex: 1, p: 1 }}>
        <CardMedia
          component="img"
          image={book?.coverUrl}
          alt={book?.title}
          sx={{ width: 50, height: 75, borderRadius: 1 }}
        />

        <Box sx={{ ml: 2, flex: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            {book?.title} ({year})
          </Typography>

          <StyledRating value={entry.rate / 2} precision={0.5} readOnly sx={{ fontSize: '1rem' }} />

          <StyledFavorite isFavorite={entry.favorite}>
            {entry.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </StyledFavorite>
        </Box>
      </Card>
    </Box>
  );
}

function DiaryPage() {
    const { user } = useAuth();
    const [ entries, setEntries ] =  useState([]);

    useEffect(() => {
        // setIsLoading(true);

        const fetchReviews = async () => {
        try {
            const reviews = await searchByUser(user.id);
            setEntries(reviews);
        } catch (error) {
            // feedback visual de erro
        } finally {
            // setIsLoading(false);
        }
        };

        fetchReviews();
    }, []);


    function groupEntriesByMonth(entries) {
        return entries.reduce((acc, entry) => {
            const date = new Date(entry.reviewedAt);
            const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            acc[monthKey] = acc[monthKey] || [];
            acc[monthKey].push(entry);
            return acc;
        }, {});
    }

    const groupedByMonth = groupEntriesByMonth(entries);

    return (
        <Box>
            {Object.entries(groupedByMonth).map(([month, entries]) => (
            <div key={month}>
                <Typography variant="h6">{month}</Typography>
                {entries.map(entry => (
                <DiaryEntryCard key={entry.id} entry={entry} />
                ))}
            </div>
            ))}
        </Box>
    );
}

export default DiaryPage;