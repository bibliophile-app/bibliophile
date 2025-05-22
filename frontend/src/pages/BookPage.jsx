import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Button, Stack, Typography } from '@mui/material';

import { useAuth } from '../utils/AuthContext';
import useOpenLibrary from '../utils/useOpenLibrary';

import Divider from '../atoms/Divider';
import BookImage from '../atoms/BookImage';
import ReviewHistogram from '../components/reviews/ReviewHistogram';
import ReviewSection from '../components/reviews/ReviewSection';
import ReviewForm from '../components/reviews/ReviewForm';
import { searchByBook } from '../components/reviews/utils';
import ActionsMenu from '../components/ActionsMenu';

function BookPage() {
  const { user } = useAuth();
  const { olid } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews ] = useState(null);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  const { fetchResults, loading } = useOpenLibrary({
    onResults: setBook,
    onError: setError,
  });

  const fetchReviews = async () => {
    const results = await searchByBook(olid);
    setReviews(results);
  }

  useEffect(() => {
    if (!olid) return;

    fetchResults(null, olid);
    fetchReviews();
  }, [olid]);

  if (loading || !book) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={4}>
        Erro ao buscar livro: {error.message}
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ minHeight: '100vh', justifyContent: 'center', px: { xs: 3, lg: 0 } }}>
        <Stack spacing={4} direction="row">
    
          {/* Capa do livro */}
          <BookImage
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            sx={{ width: {sx: '50%', md: '180px'}}}
          />

          {/* Detalhes do livro */}
          <Stack spacing={2} sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {book.title}
              </Typography>
              {book.author_name && (
              <Typography variant="subtitle1" color="text.secondary">
                  {book.author_name.join(', ')}
              </Typography>
              )}
              {book.first_publish_year && (
              <Typography variant="body2" color="text.secondary">
                  Publicado em {book.first_publish_year}
              </Typography>
              )}
              <Divider />
              {book.description && (
              <Typography variant="body1" sx={{ mt: 2, minHeight: "10%" }}>
                  {typeof book.description === 'string'
                    ? book.description
                    : book.description.value}
                </Typography>
              )}

              {/* Placeholder de reviews */}
              <Box mt={6}>
                {user && <ReviewSection title={"Your reviews"} reviews={reviews?.filter(review => review.username === user.username)}/> }
                <ReviewSection title={"Recent reviews"} reviews={reviews?.filter(review => review.username !== user?.username)}/>
            </Box>              
          </Stack>

          {/* Ações e avaliação */}
          <Stack direction="column" alignItems="flex-start" sx={{ mt: 3, width: {sx: '50%', md: '240px'}}}>      
            <ActionsMenu handleReview={() => setReviewFormOpen(true)} />

            <Typography variant="h5" gutterBottom>
              Ratings
            </Typography>
            <Divider sx={{ width: '100%', mb: 2 }} />
          
            <ReviewHistogram reviews={reviews}/>
          </Stack>

          </Stack>     
        </Box>

        <ReviewForm 
          book={book}
          open={reviewFormOpen} 
          onClose={() => { fetchReviews(); setReviewFormOpen(false); }}/>
      </>
    );
}

export default BookPage;
