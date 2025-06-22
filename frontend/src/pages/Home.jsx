import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { Box, Typography } from '@mui/material'; 
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
    padding: '50px 0', // Espaçamento vertical
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
      <Typography variant="h2">
        Bem vindo, {user.username}. Veja o que andamos lendo...
      </Typography>
      <PopularFriendsReviewsSection friends={user.friends || []} /> {/* Seção de resenhas populares dos amigos */}
      <PopularReviewsSection /> {/* Seção de resenhas populares */}
    </Box>
  );
}

export default Home;