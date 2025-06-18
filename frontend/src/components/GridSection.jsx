import { Box, Typography } from '@mui/material';

import PosterCard from './PosterCard';
import ReviewPosterCard from './reviews/ReviewPosterCard';

const CARD_WIDTH = 128;
const CARD_HEIGHT = 196;

function GridSection({ title, description, items, onSelect, type="book" }) {
  return (
    <Box sx={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Cabeçalho */}
      {title && (
        <Box sx={{ mt: 1, mb: 4 }}>
          <Typography variant="h3" sx={{ mb: .5, color: 'neutral.secondary', letterSpacing: 1 }} >
            {title}
          </Typography>

          {description &&
            <Typography
              variant="h5"
              sx={{ color: '#ccc', letterSpacing: 1 }}
            >
              {description}
            </Typography>
          }
        </Box>
      )}

      {/* Itens */}
      {(!items || items.length === 0) ?
        <Typography variant='p'>
          A lista está vazia...
        </Typography>
      :  <Box
          sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2,
            maxWidth: '100vw',
            overflowX: 'hidden',
          }}
        >
          {items.map((item, index) => (type == "book" ? (
              <PosterCard key={index} bookId={item} width={CARD_WIDTH} height={CARD_HEIGHT} onDelete={onSelect} />
            ) : (
              <ReviewPosterCard key={index} review={item} width={CARD_WIDTH} height={CARD_HEIGHT} />
          )))}
        </Box>
      }
    </Box>
  );
}

export default GridSection;
