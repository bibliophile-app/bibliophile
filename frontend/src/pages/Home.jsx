import { useAuth } from '../utils/AuthContext';
import { Box, Typography } from '@mui/material'; 
import { Link as RouterLink } from 'react-router-dom';

import FeaturesSection from '../components/home/FeaturesSection';
import ActivityNetwork from '../components/home/ActivityNetwork';
import ActivityFriends from '../components/home/ActivityFriends';

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
        <ActivityNetwork /> {/* Adiciona a seção de resenhas populares */}
      </Box>
    );
  }

  return (
    <Box sx={homeContainerStyle}>
      <Box sx={{ alignContent: 'center', textAlign: 'center' }}>
        <Typography variant='h4'>
          Bem vindo,{' '}
          <Typography
            variant='h4'
            component={RouterLink}
            onClick={() => window.location.href = `/${user.username}/profile`}
          >
            {user.username}
          </Typography>
          {' :)'}
        </Typography>

        <Typography variant='h4'>
          Veja o que andamos lendo...
        </Typography>
      </Box>
      <ActivityFriends />
      <ActivityNetwork />
    </Box>
  );
}

export default Home;