import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ListSection from '../ListSection';

function ActivityNetwork() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function getPopularBooks() {
      try {
        const response = await fetch('/reviews/popular/week');
        const data = await response.json();
        setBooks(data);
      } catch {
        setBooks([]);
      } finally {
      }
    }
    getPopularBooks();
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mt: 5, mb: 4 }}>
      <ListSection
        pathTo="/popular/week"
        title="LIVROS POPULARES DA SEMANA"
        items={books}
        type="book"
      />
    </Box>
  );
};

export default ActivityNetwork;
