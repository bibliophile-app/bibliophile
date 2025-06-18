import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import Divider from '@/atoms/Divider';
import PosterCard from './PosterCard';
import ReviewPosterCard from './reviews/ReviewPosterCard';

const CARD_WIDTH = 131;
const CARD_HEIGHT = 196;
const CARD_GAP = 10;

function ListSection({ pathTo, title, items, type = "book" }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [maxVisible, setMaxVisible] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const containerWidth = container.offsetWidth;
      const totalCardWidth = CARD_WIDTH + CARD_GAP;
      const count = Math.floor((containerWidth + CARD_GAP) / totalCardWidth);
      console.log(count)
      setMaxVisible(count);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const visibleItems = items?.slice(0, maxVisible) ?? [];

  return (
    <Box>
      {/* Cabeçalho */}
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'baseline' }}>
        <Typography
          variant="p"
          sx={{ color: 'neutral.secondary', letterSpacing: 1 }}
        >
          {title}
        </Typography>

        <Button
          onClick={() => navigate(pathTo)}
          sx={{ fontSize: '0.8rem', textTransform: 'lowercase', ml: 'auto' }}
        >
          mais
        </Button>
      </Box>

      <Divider sx={{ opacity: 0.5, mb: 2  }} />

      {/* Itens (visíveis dinamicamente) */}
      {visibleItems && (
        <Box ref={containerRef} sx={{ display: 'flex', gap: `${CARD_GAP}px` }}>
          {visibleItems.map((item, index) =>
            type === 'book' ? (
              <PosterCard key={index} bookId={item} width={CARD_WIDTH} height={CARD_HEIGHT}/>
            ) : (
              <ReviewPosterCard key={index} review={item} width={CARD_WIDTH} height={CARD_HEIGHT} />
            )
          )}
        </Box>
      )}
    </Box>
  );
}

export default ListSection;