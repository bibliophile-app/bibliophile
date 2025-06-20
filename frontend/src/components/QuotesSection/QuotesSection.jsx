import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Divider } from '@mui/material';
import QuoteCard from '../QuoteCard/QuoteCard';

function getRandomQuotes(quotes, maxCards) {
  if (quotes.length <= maxCards) return quotes;
  // Fisher-Yates shuffle para garantir aleatoriedade
  const shuffled = [...quotes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, maxCards);
}

const QuotesSection = ({ quotes, user }) => {
  const navigate = useNavigate();
  const maxCards = 4;
  const shownQuotes = getRandomQuotes(quotes, maxCards);
  const emptySlots = maxCards - shownQuotes.length;

  const handleNavigate = () => {
    if (user?.username) {
      navigate(`/${user.username}/quotes`);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 900,
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 400, color: 'neutral.main', fontFamily: 'Inter, Helvetica Neue, sans-serif', fontSize: '1.1rem', textTransform: 'none', letterSpacing: 0 }}>
          CITAÇÕES FAVORITAS
        </Typography>
        <Button
          onClick={handleNavigate}
          variant="text"
          sx={{ color: 'neutral.main', fontWeight: 400, fontSize: '0.80rem', textTransform: 'none', p: 0, minWidth: 'unset' }}
        >
          mais
        </Button>
      </Box>
      <Divider sx={{ borderColor: '#334355', mb: 2 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 2, justifyItems: 'start' }}>
        {shownQuotes.map(quote => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
        {/* Preenche espaços vazios para manter alinhamento à esquerda */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <Box key={i} sx={{ visibility: 'hidden', minWidth: 340, maxWidth: 420 }} />
        ))}
      </Box>
    </Box>
  );
};

export default QuotesSection;