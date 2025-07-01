import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Divider } from '@mui/material';
import QuoteCard from './QuoteCard';

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
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 1 }}>
        <Typography
          variant="p"
          sx={{ color: 'neutral.secondary', textTransform: 'uppercase' }}
        >
          Citações Favoritas
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
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gridTemplateRows: 'repeat(2, auto)',
        rowGap: 0.9,
        columnGap: 0.9,
        justifyContent: 'start',
        alignItems: 'start',
      }}>
        {shownQuotes.length > 0 ? (
          shownQuotes.map((quote, idx) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))
        ) : (
          <Box sx={{ gridColumn: '1/-1', width: '100%' }}>
            <Typography variant="body2" sx={{ color: '#aaa', px: 1, py: 2 }}>
              Nenhuma citação encontrada.
            </Typography>
          </Box>
        )}
        {/* Preenche espaços vazios para manter alinhamento à esquerda */}
        {shownQuotes.length < 4 && Array.from({ length: emptySlots }).map((_, i) => (
          <Box key={i} sx={{ visibility: 'hidden' }} />
        ))}
      </Box>
    </Box>
  );
};

export default QuotesSection;