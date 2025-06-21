import React from 'react';
import { Box, Typography } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Divider from '@/atoms/Divider';

/**
 * QuoteItem - Component for displaying quotes in the Quotes page
 * This is different from QuoteCard which is used in the Profile page
 */
function QuoteItem({ quote, onClick }) {
  return (
    <>
      <Box
        sx={{
          py: 1.5,
          px: 0,
          borderRadius: 0,
          bgcolor: 'transparent', // sem caixinha
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center', // centraliza verticalmente
          gap: 1.5,
        }}
        onClick={onClick}
      >
        <FormatQuoteIcon sx={{ color: '#CFD8DC', fontSize: 30, opacity: 0.4 }} />
        <Typography
          variant="body2"
          sx={{
            color: 'neutral.main',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            fontFamily: 'Inter, Helvetica Neue, sans-serif',
            fontSize: '1rem',
            fontWeight: 400,
            fontStyle: 'italic', // força itálico padrão
            lineHeight: 1.5,
          }}
        >
          {quote.content}
        </Typography>
      </Box>
      <Divider sx={{ opacity: 0.5, my: 1 }} />
    </>
  );
}

export default QuoteItem;
