import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useOpenLibrary from '@/utils/useOpenLibrary';
import { useAuth } from '@/utils/AuthContext';
import { searchByBook } from '@/utils/reviews';
import { BooklistConstants } from '@/utils/constants';
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
import AddToListForm from '../components/lists/ListForm';

function ActionsMenu({ handleReview, book }) {
  const { notify } = useNotification();
  const { user, isAuth, handleSignin } = useAuth();
  
  const [ lists, setLists ] = useState([]);
  const [ listFormOpen, setListFormOpen ] = useState(false);
  const [ reviewFormOpen, setReviewFormOpen ] = useState(false);

  async function fetchUserLists() {
      const response = await searchByUser(user.id);
      setLists(response);
  }

  async function addTBR(bookId) {
      if (!lists || !bookId) return;

      const tbr = lists.find((list) => list.listName == BooklistConstants.DEFAULT_LIST_NAME);
      try {
        await addBook(tbr.id, bookId);
        notify({ message: 'Livro adicionado à "Quero ler"', severity: 'success' })
      } catch (e) {
        if ((e?.response?.status === 409) || (typeof e?.message === 'string' && e.message.includes('409'))) {
          notify({ message: 'O livro já está na lista', severity: 'info'});
        } else {
          notify({ message: 'Erro ao adicionar livro à lista', severity: 'error'});
        }
      }
  }

  async function addToLists(listIds, bookId) {
    try {
      for (const listId of listIds) {
        await addBook(listId, bookId);   
      }
    } catch {
      notify({ message: 'Erro ao adicionar livro à lista', severity: 'error'});
    }
    await fetchUserLists();
  }

  useEffect(() => {
    if (!isAuth()) return;
    fetchUserLists();
  }, [user]);

  const actions = isAuth()
    ? [
        {
          label: 'Quero ler',
          icon: <PlaylistAdd />,
          onClick: () => addTBR(book.id),
        },
        {
          label: 'Avaliar ou registrar novamente...',
          onClick: () => setReviewFormOpen(true),
        },
        {
          label: 'Adicionar às listas...',
          onClick: () => setListFormOpen(true),
        },
      ]
    : [
        {
          label: 'Faça login para registrar, avaliar ou comentar',
          onClick: handleSignin,
        },
      ];

  return ( 
      <React.Fragment>
          <ActionsBase actions={actions} />
          <AddToListForm 
            book={book}
            open={listFormOpen}
            lists={lists?.filter(l => l.listName !== BooklistConstants.DEFAULT_LIST_NAME)}
            onClose={() => setListFormOpen(false)}
            onSubmit={(ids, bookId) => addToLists(ids, bookId)}
          />
          
          <ReviewForm
            book={book}
            open={reviewFormOpen}
            onClose={() => setReviewFormOpen(false)}
            onSubmit={() => { handleReview(); setReviewFormOpen(false); }}
          />
      </React.Fragment>
  );
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
  };

  if (loading || !book) return <LoadingBox />;
  
  return (
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
          width: { xs: 'auto', sm: 175, md: 240 },
        }}
      >
        {!isMdUp && <BookImage src={book.coverUrl} alt={`Capa de ${book.title}`} sx={{ width: 175, height: 270 }} /> }

        <ActionsMenu handleReview={handleReviewSubmit} book={book} />

        <Box>
          <Typography variant="h5" gutterBottom>
            Avaliações
          </Typography>
          <Divider sx={{ width: '100%', mb: 2 }} />
          <ReviewHistogram reviewsData={reviews} />
        </Box>
      </Box>
    </Stack>
  );
}

export default BookPage;