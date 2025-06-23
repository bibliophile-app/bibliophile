import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ListSection from '../ListSection';

const PopularReviewsSection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPopularBooks() {
      setLoading(true);
      try {
        const response = await fetch('/reviews/popular/week');
        const data = await response.json();
        setBooks(data);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    getPopularBooks();
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mt: 5, mb: 4 }}>
      <ListSection
        pathTo="/reviews/popular/week"
        title="LIVROS POPULARES DA SEMANA"
        items={books}
        type="book"
      />
    </Box>
  );
};

export default PopularReviewsSection;
