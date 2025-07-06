import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Tooltip, IconButton } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { Link as RouterLink } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

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
  onDelete, // nova prop opcional
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
    <Box sx={{ width, position: 'relative', overflow: 'hidden' }}>
      {/* Botão de deletar */}
      {onDelete && (
        <IconButton
          onClick={() => onDelete(book)}
          sx={{
            zIndex: 1,
            p: '8px',
            width: '16px',
            height: '16px',
            
            position: 'absolute',
            top: '6px',
            right: '6px',
            backgroundColor: 'neutral.secondary',
            '&:hover': {
              backgroundColor: 'error.main',
              color: 'white.main',
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: '16px', color: 'inherit' }} />
        </IconButton>
      )}


      <StyledTooltip title={book.title} placement="top" arrow>
        <Box
          component={RouterLink}
          to={`/book/${bookId}`}
          sx={{
            position: 'relative',
            display: 'block',
            overflow: 'hidden',
            textDecoration: 'none',
            borderRadius: 1,
            border: '2px solid transparent',
            transition: 'all 0.3s ease',
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

          {overlay && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                py: 0.5,
                bgcolor: 'background.contrast',
                borderBottomLeftRadius: '4px',
                borderBottomRightRadius: '4px',
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
