import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useOpenLibrary from '@/utils/useOpenLibrary';
import { useAuth } from '@/utils/AuthContext';
import { searchByBook } from '@/utils/reviews';
import { searchByUser, addBook } from '@/utils/lists';
import { handleSafeNavigation } from '@/utils/handlers';
import { useNotification } from '@/utils/NotificationContext';

import Divider from '@/atoms/Divider';
import BookImage from '@/atoms/BookImage';
import LoadingBox from '@/atoms/LoadingBox';
import BookHeader from '@/components/BookHeader';
import ActionsBase from '@/components/ActionsBase';
import ReviewForm from '@/components/reviews/ReviewForm';
import ExpandableText from '@/components/ExpandableText';
import ReviewSection from '@/components/reviews/ReviewSection';
import ReviewHistogram from '@/components/reviews/ReviewHistogram';

function ActionsMenu({ handleReview, bookId }) {
  const { user, isAuth, handleSignin } = useAuth();
  const [ lists, setLists ] = useState([]);

  useEffect(() => {
    if (!isAuth()) return;

    async function fetchUserLists() {
      const response = await searchByUser(user.id);
      setLists(response);
    }

    fetchUserLists();
  }, [user]);

  async function addTBR(bookId) {
      if (!lists || !bookId) return;

      const tbr = lists.find((list) => list.listName == '___DEFAULT___');
      await addBook(tbr.id, bookId);
  }

  const actions = isAuth()
    ? [
        {
          label: 'Quero ler',
          icon: <PlaylistAdd />,
          onClick: () => addTBR(bookId),
        },
        {
          label: 'Avaliar ou registrar novamente...',
          onClick: handleReview,
        },
        {
          label: 'Adicionar às listas...',
          onClick: () => console.log('Abrir listas'),
        },
      ]
    : [
        {
          label: 'Faça login para registrar, avaliar ou comentar',
          onClick: handleSignin,
        },
      ];

  return <ActionsBase actions={actions} />;
}

function BookPage() {
  const { isAuth } = useAuth();
  const { bookId } = useParams();
  const { notify } = useNotification();
  const safeBack = handleSafeNavigation();

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState({});
  const [formOpen, setFormOpen] = useState(false);

  const { fetchResults, loading } = useOpenLibrary({
    onError: () => {
        notify({ message: 'Erro ao carregar os dados do livro!', severity: 'error' })
        setTimeout(() => safeBack(), 1500);
    },
  });

  async function fetchReviews() {
    if (!bookId) return;
    try {
      const results = await searchByBook(bookId);
      setReviews(results || {});
    } catch (err) {
      notify({ message: 'Erro ao buscar avaliações!', severity: 'alert' });
    }
  };

  useEffect(() => {
    if (!bookId) return;

    async function fetchBook() {
      const book = await fetchResults(null, bookId);
      setBook(book);
    }

    fetchBook();
    fetchReviews();
  }, [bookId]);

  function handleReviewSubmit() {
    fetchReviews();
    setFormOpen(false);
  };

  if (loading || !book) return <LoadingBox />;
  
  return (
    <React.Fragment>
      <Stack spacing={4} direction="row">
        {isMdUp && <BookImage src={book.coverUrl} alt={`Capa de ${book.title}`} sx={{ width: 180, height: '100%' }} /> }

        <Stack spacing={2} sx={{ flex: 1 }}>
          <BookHeader
            title={book.title}
            year={book.publish_year}
            authors={book.authors}
          />

          <Divider />
          <ExpandableText text={book.description} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isAuth() && (
              <ReviewSection
                title="Minhas avaliações"
                reviews={reviews.user?.filter(e => !!e.content?.trim())}
              />
            )}

            {isAuth() && reviews.friends?.length > 0 && (
              <ReviewSection
                title="Avaliações de amigos"
                reviews={reviews.friends?.filter(e => !!e.content?.trim())}
              />
            )}

            <ReviewSection
              title="Avaliações"
              reviews={reviews.others?.filter(e => !!e.content?.trim())}
            />
          </Box>
        </Stack>

        <Box
          sx={{
            gap: 2,
            display: 'flex',
            flexDirection: 'column',
            width: { xs: 'auto', sm: 180, md: 240 },
          }}
        >
          {!isMdUp && <BookImage src={book.coverUrl} alt={`Capa de ${book.title}`} sx={{ width: 180, height: 270 }} /> }

          <ActionsMenu handleReview={() => setFormOpen(true)} bookId={book.id} />

          <Box>
            <Typography variant="h5" gutterBottom>
              Avaliações
            </Typography>
            <Divider sx={{ width: '100%', mb: 2 }} />
            <ReviewHistogram reviewsData={reviews} />
          </Box>
        </Box>
      </Stack>

      <ReviewForm
        book={book}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </React.Fragment>
  );
}

export default BookPage;