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
import PagesNavigation from '@/components/NavigationTabs/PagesNavigation';
import UserAvatar from '@/atoms/UserAvatar';


function QuotesPage() {
  const { username } = useParams();
  const { notify } = useNotification();
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);

  const isOwner = user && username === user.username;

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
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Topo: avatar, nome e botão */}
        
         <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 4 }}>
          
            <Typography variant='h5' sx={{ alignSelf: 'center' }}>
                Guarde suas citações preferidas e compartilhe no seu perfil.
            </Typography>

            <Button 
                variant="contained"
                onClick={() => handleOpenQuoteForm(null)}
                  
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#b0bec5',
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                  px: 2,
                  py: .5,
                  fontSize: '0.95rem'
                }}
                
              >
                Salve sua citação favorita
              </Button>
            
          </Box>

          <Box sx={{height: 20 }}></Box>
        

      {/* NavigationTabs logo abaixo */}
      <PagesNavigation username={username} />
      {/* Quotes do usuário */}
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
