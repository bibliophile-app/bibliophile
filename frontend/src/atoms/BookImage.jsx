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

function BookImage({ src, alt = 'Book cover', width = 180, height = 240, sx = {} }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  const showFallback = error || !src;

  return (
    <BookCover
      hasImage={!showFallback}
      sx={{
        width,
        height,
        ...sx,
      }}
      variant="rounded"
    >
      {!showFallback ? (
        <>
          {!loaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ position: 'absolute', top: 0, left: 0 }}
            />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{
              display: loaded ? 'block' : 'none',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
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
  );
}

export default React.memo(BookImage);
