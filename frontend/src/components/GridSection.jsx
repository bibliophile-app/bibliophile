import { Box, Typography } from '@mui/material';

import PosterCard from './PosterCard';
import ReviewPosterCard from './reviews/ReviewPosterCard';

function GridSection({ title, description, items, type="book" }) {
  return (
    <Box>
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

      {(!items || items.length === 0) ?
        <Typography variant='p'>
          A lista está vazia...
        </Typography>
      :  <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(3, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(6, 1fr)',
              lg: 'repeat(8, 1fr)',
            },
          }}
        >
          {items.map((item, index) => (type == "book" ? (
              <PosterCard key={index} bookId={item} width={131} height={196} />
            ) : (
              <ReviewPosterCard key={index} review={item} width={131} height={196} />
          )))}
        </Box>
      }
    </Box>
  );
}

export default GridSection;
