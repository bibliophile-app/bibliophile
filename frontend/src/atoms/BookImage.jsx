import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Skeleton, Box } from '@mui/material';

const BookCover = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'hasImage',
})(({ hasImage, theme }) => ({
  position: 'relative',
  borderRadius: 4,
  backgroundColor: hasImage ? 'transparent' : theme.palette.grey[300],
  flexShrink: 0,
  overflow: 'hidden',
}));

const loadedImages = new Set();

function BookImage({
  src,
  alt = 'Book cover',
  width = 120,
  height = 180,
  sx = {},
}) {
  const [loaded, setLoaded] = useState(() => loadedImages.has(src));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    if (loadedImages.has(src)) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
    setError(false);
  }, [src]);

  const handleLoad = () => {
    loadedImages.add(src);
    setLoaded(true);
  };

  const showFallback = error || !src;

  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        ...sx,
      }}
    >
      <BookCover
        hasImage={!showFallback}
        variant="rounded"
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        {!showFallback ? (
          <>
            {!loaded && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bgcolor: 'rgba(150, 150, 150, 0.1)',
                  zIndex: 1,
                }}
              />
            )}
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onLoad={handleLoad}
              onError={() => setError(true)}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
            />
          </>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              fontSize: 16,
              color: 'text.disabled',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontStyle: 'italic',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            N/A
          </Box>
        )}
      </BookCover>
    </Box>
  );
}

export default React.memo(BookImage);