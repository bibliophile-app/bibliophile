import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Divider, Pagination, Stack, Typography, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import LoadingBox from '../atoms/LoadingBox';
import useOpenLibrary from '../utils/useOpenLibrary';
import Categories from '../components/search/Categories';
import ResultBooks from '../components/search/ResultBooks';
import ResultUsers from '../components/search/ResultUsers';
import ResultBooklists from '../components/search/ResultBooklists';
import { fetchAllUsers } from '../utils/users';
import { fetchLists } from '../utils/lists';

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
  const [userResults, setUserResults] = useState([]);
  const [booklists, setBooklists] = useState([]);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('Livros');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { fetchResults, loading } = useOpenLibrary({
    onError: setError,
  });

  useEffect(() => {
    if (!query) return;
    setPage(1);
    console.log('Categoria selecionada:', category);
    if (category === 'Livros') {
      async function getResults() {
        const results = await fetchResults(query);
        setResults(results);
      }
      getResults();
    } else if (category === 'Usuários') {
      async function getUserResults() {
        try {
           console.log('entra aqui ');
          const users = await fetchAllUsers();
          console.log('users armazena:', users);
          setUserResults(users);
        } catch (e) {
          setUserResults([]);
        }
      }
      // Limpa resultados antigos antes de buscar
      getUserResults();
    } else if (category === 'Listas') {
      setError(null);
      (async () => {
        try {
          const allLists = await fetchLists();
          // Filtra listas pelo nome contendo a query (case-insensitive)
          const filtered = allLists.filter(list =>
            list.listName && list.listName.toLowerCase().includes(query.toLowerCase())
          );
          setBooklists(filtered);
        } catch (err) {
          setError(err.message || 'Erro ao buscar listas');
          setBooklists([]);
        }
      })();
    }
  }, [query, category]);

  const paginatedResults = results.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return <LoadingBox />
  }

  if (error) {
    return (
      <Typography color="error" mt={4}>
        Erro ao buscar livros: {error.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', justifyContent: 'center' }}>
      <Stack spacing={4} direction="row">
        <Stack sx={{ width: { xs: "100%", md: "70%" } }}>
          <Typography variant="body" fontSize={"0.8rem"} gutterBottom>
            MOSTRANDO RESULTADOS PARA “{query.toUpperCase()}”
          </Typography>
          <Divider sx={{ my: 2, bgcolor: "background.muted" }} />

          {category === 'Livros' && (
            <>
              <ResultBooks books={results} paginatedBooks={paginatedResults}/>
              {results.length > 0 &&
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <StyledPagination
                    count={Math.ceil(results.length / ITEMS_PER_PAGE)}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                  />
                </Box>
              }
            </>
          )}

          {category === 'Usuários' && (
            <ResultUsers users={userResults} query={query} />
          )}

          {category === 'Listas' && (
            <ResultBooklists lists={booklists} />
          )}
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
