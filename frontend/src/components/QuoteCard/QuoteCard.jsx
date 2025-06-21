import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
const StyledQuoteCard = styled(Box)(({ theme }) => ({
  border: '1px solid #888',
  borderRadius: 8,
  background: '#334355', // background.muted do MUITheme
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 15,
  width: '100%',
  boxShadow: 'none',
  color: '#dfe6ec',
  minWidth: 340,
  maxWidth: 420,
  minHeight: 60,
  //maxHeight: 150,
  height: 145,
}));

const QuoteContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row', // Alinha ícone e texto em linha
  alignItems: 'flex-start', // Ícone no topo esquerdo
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  maxWidth: 400,
  minWidth: 340,
  minHeight: 40,
  maxHeight: 150,
}));

const QuoteText = styled(Typography)(({ theme }) => ({
  fontSize: '1em',
  fontStyle: 'italic',
  margin: 0,
  lineHeight: 1.4,
  wordBreak: 'break-word',
  color: '#dfe6ec',
  width: '100%',
  textAlign: 'left', // Alinha texto à esquerda
  overflow: 'visible',
  maxWidth: 400,
  minWidth: 0,
  minHeight: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: 8, // Espaço entre ícone e texto
}));

const QuoteCard = ({ quote }) => {
  // Limita o texto a 255 caracteres
  const text = quote.content?.length > 255
    ? quote.content.slice(0, 252) + '...'
    : quote.content;

  return (
    <StyledQuoteCard>
      <QuoteContent>
        <FormatQuoteIcon
          sx={{
            color: '#CFD8DC',
            fontSize: 35,
            mt: 0.5,
            flexShrink: 0,
            alignSelf: 'flex-start',
            opacity: 0.4,
          }}
        />
        <QuoteText component="p">
          {text}
        </QuoteText>
      </QuoteContent>
    </StyledQuoteCard>
  );
};

export default QuoteCard;