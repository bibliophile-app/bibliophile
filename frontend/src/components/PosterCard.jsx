import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Tooltip } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { Link as RouterLink } from 'react-router-dom';

import BookImage from '../atoms/BookImage';
import useOpenLibrary from '../utils/useOpenLibrary';


const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.contrast,
    fontSize: 11,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.contrast,
  },
}));

function PosterCard({
  bookId,
  overlay,
  width = 160,
  height = 253,
}) {
  const [book, setBook] = useState(null);

  const { fetchResults } = useOpenLibrary({
    onError: null,
  });

  useEffect(() => {
    if (!bookId) return;
    
    async function fetchBook() {
      const book = await fetchResults(null, bookId);
      setBook(book);
    }
    
    fetchBook();
  }, [bookId]);

  if (!book) return null;

  return (
    <Box sx={{ width }}>
      <StyledTooltip title={book.title} placement="top" arrow>
        <Box component={RouterLink} to={`/book/${bookId}`}
          sx={{
            position: 'relative',
            display: 'block',
            overflow: 'hidden',
            textDecoration: 'none',
            borderRadius: 1,
            transition: 'all 0.3s ease',
            border: '2px sbookId transparent',
            boxShadow: 3,
            '&:hover': {
                borderColor: '#ffffffdd',
            },
            }}
        >
          <BookImage
            src={book.coverUrl}
            alt={`Capa de ${book.title}`}
            sx={{ width: '100%', height }}
          />

          {/* Overlay (ex: avatar + username) */}
          {overlay && (
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    px: 1,
                    py: 0.5,
                    bgcolor: 'background.contrast',
                }}
            >
                {overlay}
            </Box>
          )}
        </Box>
      </StyledTooltip>
    </Box>
  );
}

export default PosterCard;
