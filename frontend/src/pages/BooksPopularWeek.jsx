import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Divider from '../atoms/Divider';
import LoadingBox from '../atoms/LoadingBox';
import GridSection from '../components/GridSection';
import { fetchPopularBooksWeek } from '../utils/reviews';
import { useNotification } from '../utils/NotificationContext';

function BooksPopularWeek() {
  const { notify } = useNotification();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchBooks = async () => {
      try {
        const result = await fetchPopularBooksWeek();
        setBooks(result);
        setLoading(false);
      } catch (error) {
        notify({
          message: 'Erro ao carregar livros populares da semana!',
          severity: 'error',
        });
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <LoadingBox />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 400, color: 'neutral.main', fontFamily: 'Inter, Helvetica Neue, sans-serif', fontSize: '1rem', textTransform: 'none', letterSpacing: 0 }}>
            LIVROS POPULARES DA SEMANA
        </Typography>
        <Divider sx={{ borderColor: '#334355', mb: 2 }} />
      <GridSection 
        title="" 
        description={"Livros mais populares baseados nas reviews desta semana."} 
        items={books} 
        type='book'
      />
    </Box>
  );
}

export default BooksPopularWeek;
