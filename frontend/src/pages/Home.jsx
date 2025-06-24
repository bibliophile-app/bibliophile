import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { Box, Typography } from '@mui/material'; 
import { styled } from '@mui/material';

import FeaturesSection from '../components/home/FeaturesSection';
import PopularReviewsSection from '../components/PopularReviewsSection/PopularReviewsSection';
import PopularFriendsReviewsSection from '../components/PopularReviewsSection/PopularFriendsReviewsSection';

function Home() {
  const { user, isAuth } = useAuth();

  // Estilo para o contêiner principal da Home
  const homeContainerStyle = {
    minHeight: '100vh', // Garante que ocupe a altura total da viewport
    color: '#E0E0E0', // Cor do texto padrão
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    padding: '5px 0', // Espaçamento vertical (aqui o "50px" é a distância do topo)
    boxSizing: 'border-box',
    mt: 0,
  };

  if (!isAuth()) {
    return (
      <Box sx={homeContainerStyle}>
        <FeaturesSection /> {/* Mostra os cards mesmo se não estiver logado */}
        <PopularReviewsSection /> {/* Adiciona a seção de resenhas populares */}
      </Box>
    );
  }

  return (
    <Box sx={homeContainerStyle}>
      <Typography variant="h4">
        Bem vindo,{' '}
        <Box
          component="span"
          sx={{
            cursor: 'pointer',
            display: 'inline',
            transition: 'color 0.2s',
            '&:hover': { color: '#556677' },
          }}
          onClick={() => window.location.href = `/${user.username}/profile`}
        >
          {user.username}
        </Box>
        . Veja o que andamos lendo...
      </Typography>
      <PopularFriendsReviewsSection />
      <PopularReviewsSection />
    </Box>
  );
}

export default Home;