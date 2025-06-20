import React from 'react';
import { Box, Typography } from '@mui/material';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
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
        <FormatQuoteOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
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
      <Divider />
    </>
  );
}

export default QuoteItem;
