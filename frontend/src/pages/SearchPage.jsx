import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Divider, Pagination, Stack, Typography, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import useOpenLibrary from '../utils/useOpenLibrary';
import Categories from '../components/search/Categories';
import ResultBooks from '../components/search/ResultBooks';
import ResultUsers from '../components/search/ResultUsers';

const ITEMS_PER_PAGE = 10;

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: theme.palette.neutral.main,
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#0d47a1',
    },
  },
}));

function SearchPage() {
  const { query } = useParams();
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('Books');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { fetchResults, loading } = useOpenLibrary({
    onResults: setResults,
    onError: setError,
  });

  useEffect(() => {
    if (!query) return;
    setPage(1);
    setResults([]);
    setError(null);

    if (category === "Books") {
      fetchResults(query);
    } else if (category === "Users") {
      //TO DO: consertar
      fetch('http://localhost:8080/users?search=' + encodeURIComponent(query))
        .then(results => {
          console.log("Status da resposta:", results.status);
            return results.json();
          })
          .then(data => setResults(data))
          .catch(err => {
          console.error("Erro completo:", err);
          setError(err);
        });
    }
  }, [query, category]);

  const paginatedResults = results.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={4}>
        Erro ao buscar livros: {error.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', justifyContent: 'center', px: { xs: 33, lg: 0 } }}>
      <Stack spacing={4} direction="row">
        <Stack sx={{ width: { xs: "100%", md: "70%" } }}>
          <Typography variant="body" fontSize={"0.8rem"} gutterBottom>
            SHOWING RESULTS FOR “{query.toUpperCase()}”
          </Typography>
          <Divider sx={{ my: 2, bgcolor: "background.muted" }} />

          { category === 'Users' && <ResultUsers users={paginatedResults} /> } 
          { category === 'Books' && <ResultBooks books={results} paginatedBooks={paginatedResults}/>}

          
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <StyledPagination
              count={Math.ceil(results.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={(_, val) => setPage(val)}
            />
          </Box>
        </Stack>

        {!isMobile && (
          <Stack sx={{ width: "30%" }}>
            <Categories selected={category} onSelect={setCategory}/>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default SearchPage;
