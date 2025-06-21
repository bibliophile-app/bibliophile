import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNotification } from '@/utils/NotificationContext';
import { useAuth } from '@/utils/AuthContext';
import QuoteForm from '@/components/quotes/QuoteForm';
import QuoteItem from '@/components/quotes/QuoteItem';
import LoadingBox from '@/atoms/LoadingBox';
import { searchQuotesByUser } from '@/utils/quotes';
import Divider from '@/atoms/Divider'


// Função utilitária para buscar citações do usuário

function QuotesPage() {
  const { username } = useParams();
  const { notify } = useNotification();
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);

  const isOwner = user && username === user.username;

  // Busca todas as citações do usuário
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await searchQuotesByUser(username);
      setQuotes(data);
    } catch (e) {
      notify({ message: 'Erro ao carregar citações!', severity: 'error' });
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchQuotes();
    // eslint-disable-next-line
  }, [username]);

  function handleOpenQuoteForm(quoteId = null) {
    setEditingQuoteId(quoteId);
    setQuoteFormOpen(true);
  }

  function handleCloseQuoteForm() {
    setQuoteFormOpen(false);
    setEditingQuoteId(null);
  }

  async function handleQuoteSubmit() {
    handleCloseQuoteForm();
    await fetchQuotes();
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 400, fontFamily: 'Inter, Helvetica Neue, sans-serif', fontSize: '1.2rem', color: 'neutral.main', lineHeight: 1, display: 'flex', alignItems: 'center', minHeight: 40 }}>
          Citações de {username}
        </Typography>
        {isOwner && (
          <Button 
            variant="contained"
            onClick={() => handleOpenQuoteForm(null)}
            sx={{
              backgroundColor: (theme) => theme.palette.background.contrast,
              fontWeight: 400,
              fontSize: '1rem',
              borderRadius: '5px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              textTransform: 'none',
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.background.contrast,
                opacity: 0.9,
              },
            }}
          >
            Nova citação
          </Button>
        )}
      </Box>
      <Divider sx={{ my: 1 }} />
      
      {loading ? (
        <LoadingBox />
      ) : (
        <>
          {quotes.length === 0 ? (
            <Typography variant="body2" sx={{ py: 2 }}>
              Nenhuma citação encontrada.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {quotes.map((quote, idx) => (
                <React.Fragment key={quote.id}>
                  <QuoteItem
                    quote={quote}
                    onClick={() => isOwner && handleOpenQuoteForm(quote.id)}
                  />
                </React.Fragment>
              ))}
            </Box>
          )}
        </>
      )}
      {quoteFormOpen && (
        <QuoteForm
          open={quoteFormOpen}
          onClose={handleCloseQuoteForm}
          onSubmit={handleQuoteSubmit}
          quoteId={editingQuoteId}
        />
      )}
    </Box>
  );
}

export default QuotesPage;
