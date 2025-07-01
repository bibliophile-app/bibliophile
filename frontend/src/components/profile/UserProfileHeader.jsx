import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography, Button } from '@mui/material';
import { useAuth } from '../../utils/AuthContext';
import { Link } from 'react-router-dom';
import BottomUserProfileContainer from './BottomUserProfileContainer';
import { getFollowersCount, getFollowingCount } from '@/utils/followers';

async function fetchUserByUsername(username) {
  const res = await fetch(`/users/${username}`);
  if (!res.ok) throw new Error('Usuário não encontrado');
  return await res.json();
}

const UserAvatar = styled(Avatar)(({ theme }) => ({
  display: 'flex',
  width: 43,
  height: 43,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  flexShrink: 0,
  fontSize: 23,
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.neutral.main, // cor mais escura para o ícone/letra
}));

const MetricLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.neutral.main,
  minWidth: 60,
  padding: '0 8px',
}));

const MetricValue = styled('span')(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.95rem', // menor
  color: theme.palette.neutral.main,
}));

const MetricLabel = styled('span')(({ theme }) => ({
  fontSize: '0.70rem', // menor
  color: theme.palette.neutral.main,
  opacity: 0.7,
}));

const MetricDivider = styled('div')(({ theme }) => ({
  width: 1,
  height: 32,
  background: '#334355', // cor alterada conforme solicitado
  margin: '0 8px',
  alignSelf: 'center',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.95rem',
  borderRadius: 8,
  padding: '2px 12px', // menor altura
  marginLeft: 12,
  background: '#444', // cinza escuro
  color: '#CFD8DC', // cinza claro do tema
  textTransform: 'none',
  minHeight: 28,
  height: 28,
  boxShadow: 'none',
  '&:hover': {
    background: '#333',
    boxShadow: 'none',
  },
}));

const UserProfileHeader = ({ user }) => {
  const { user: loggedUser } = useAuth();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [userId, setUserId] = useState(user.id);

  useEffect(() => {
    // Garante que temos o id do usuário mesmo quando não é o logado
    if (!user?.id && user?.username) {
      fetchUserByUsername(user.username)
        .then(u => setUserId(u.id))
        .catch(() => setUserId(undefined));
    } else {
      setUserId(user?.id);
    }
  }, [user?.id, user?.username]);

  useEffect(() => {
    if (!userId) return;
    getFollowersCount(userId).then(setFollowersCount).catch(() => setFollowersCount(0));
    getFollowingCount(userId).then(setFollowingCount).catch(() => setFollowingCount(0));
  }, [userId]);

  const displayName = user.name && user.name.length > 0 ? user.name : user.username;
  const routeUsername = user.username;
  const isOwnProfile = loggedUser && user && loggedUser.username === user.username;

  const safeMetrics = {
    booksRated: user.metrics?.booksRated ?? 0,
    lists: user.metrics?.lists ?? 0,
    following: followingCount,
    followers: followersCount,
  };

  return (
    <Box sx={{ width: '100%', alignSelf: 'center', px: { xs: 2, sm: 3, md: 0 }, mb: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap: 3 }}>
        {/* Avatar e nome sempre à esquerda */}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <UserAvatar >
            {displayName && displayName.length > 0 ? displayName[0].toUpperCase() : '?'}
          </UserAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, height: 60 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'neutral.main', fontFamily: 'Inter, Helvetica Neue, sans-serif', fontSize: '1.8rem', m: 0, lineHeight: '60px', display: 'flex', alignItems: 'center', height: 60 }}>
              {displayName}
            </Typography>
            <BottomUserProfileContainer profileUser={user} />
          </Box>
        </Box>
        {/* Métricas sempre à direita */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, height: 60 }}>
          <MetricLink to={`/${routeUsername}/reviews`}>
            <MetricValue>{safeMetrics.booksRated}</MetricValue>
            <MetricLabel>LIVROS</MetricLabel>
          </MetricLink>
          <MetricDivider />
          <MetricLink to={`/${routeUsername}/lists`}>
            <MetricValue>{safeMetrics.lists-1}</MetricValue>
            <MetricLabel>LISTAS</MetricLabel>
          </MetricLink>
          <MetricDivider />
          <MetricLink to={`/${routeUsername}/following`}>
            <MetricValue>{safeMetrics.following}</MetricValue>
            <MetricLabel>SEGUINDO</MetricLabel>
          </MetricLink>
          <MetricDivider />
          <MetricLink to={`/${routeUsername}/followers`}>
            <MetricValue>{safeMetrics.followers}</MetricValue>
            <MetricLabel>SEGUIDORES</MetricLabel>
          </MetricLink>
        </Box>
      </Box>
      {/* <Divider sx={{ borderColor: '#888', opacity: 0.5, mt: 2, mb: 2 }} /> */}
    </Box>
  );
};

export default UserProfileHeader;