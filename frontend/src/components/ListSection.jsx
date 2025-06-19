import { Box, Button, Typography, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import Divider from '@/atoms/Divider';
import PosterCard from './PosterCard';
import ReviewPosterCard from './reviews/ReviewPosterCard';

const CARD_WIDTH = 128;
const CARD_HEIGHT = 196;
const CARD_GAP = 4;

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
      setMaxVisible(count);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const visibleItems = items?.slice(0, maxVisible) ?? [];
  const missing = Math.max(0, maxVisible - visibleItems.length);

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

      <Divider sx={{ opacity: 0.5, mb: 1 }} />

      {/* Itens visíveis + preenchimento com Skeletons */}
      <Box ref={containerRef} sx={{ display: 'flex', gap: `${CARD_GAP}px`, px: 1 }}>
        {visibleItems.map((item, index) =>
          type === 'book' ? (
            <PosterCard key={index} bookId={item} width={CARD_WIDTH} height={CARD_HEIGHT} />
          ) : (
            <ReviewPosterCard key={index} review={item} width={CARD_WIDTH} height={CARD_HEIGHT} />
          )
        )}
        {Array.from({ length: missing }).map((_, i) => (
          <Skeleton
            animation={false}
            key={`skeleton-${i}`}
            variant="rectangular"
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            sx={{ borderRadius: 1, bgcolor: 'rgba(0,0,0,0.2)' }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default ListSection;
