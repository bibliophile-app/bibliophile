import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

// Estilos personalizados usando styled do MUI para o Card
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.muted, // Cor de fundo semelhante à imagem
  color: '#E0E0E0', // Cor do texto
  borderRadius: 3, // Bordas arredondadas padrão do MUI
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch', // Ocupa toda a largura
  justifyContent: 'flex-start', // Alinha o conteúdo ao topo
  height: '115px', // Altura fixa para todos os cards
  width: '100%',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)', // Sombra para profundidade
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)', // Efeito leve ao passar o mouse
  },
  boxSizing: 'border-box',
}));

const StyledIconWrapper = styled(Box)(({ theme }) => ({
  position: 'static',
  '& svg': {
    fontSize: '2.2rem', // Tamanho maior para o ícone
    color: '#8899A6', // Cor do ícone (um cinza azulado)
  },
}));

const CardContentWrapper = styled(CardContent)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  padding: 0,
  display: 'flex',
  flexDirection: 'row', // Coloca ícone e texto lado a lado
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  '&:last-child': { paddingBottom: 0 },
}));

const FeatureCard = ({ icon: Icon, title }) => {
  return (
    <StyledCard>
      <CardContentWrapper>
        <StyledIconWrapper style={{ position: 'static', marginRight: 16 }}>
          <Icon />
        </StyledIconWrapper>
        <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
          {title}
        </Typography>
      </CardContentWrapper>
    </StyledCard>
  );
};

export default FeatureCard;