import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import UserAvatar from '@/atoms/UserAvatar';
import { NavLink, useLocation } from 'react-router-dom';

const NavContainer = styled(Box)(({ theme }) => ({
  background: 'none',
  border: '1px solid #334355',
  borderRadius: 3,
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  color: '#eee',
  width: '100%',
  margin: '0 auto 30px auto',
  boxShadow: 'none',
  boxSizing: 'border-box',
  gap: theme.spacing(2),
}));

const NavList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  width: '100%',
}));

const NavItemBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  padding: 0,
}));

const NavItem = styled(NavLink)(({ theme }) => ({
  color: '#aaa',
  textDecoration: 'none',
  fontWeight: 400,
  fontFamily: 'Inter, Helvetica Neue, sans-serif',
  fontSize: '1.1rem',
  letterSpacing: 0,
  padding: '5px 0',
  transition: 'color 0.2s',
  position: 'relative',
  textTransform: 'none',
  '&.active': {
    color: '#eee',
  },
  '&:hover': {
    color: '#eee',
  },
}));

const Underline = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  bottom: -5,
  width: '100%',
  height: 2,
  backgroundColor: '#556677',
  borderRadius: 2,
}));

const PagesNavigation = ({ username }) => {
  const location = useLocation();
  const tabs = [
    { label: 'Perfil', path: `/${username}/profile` },
    { label: 'Resenhas', path: `/${username}/reviews` },
    { label: 'Diário', path: `/${username}/diary` },
    { label: 'Citações', path: `/${username}/quotes` },
    { label: 'Listas', path: `/${username}/lists` },
  ];

  return (
    <NavContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 3 }}>
        <UserAvatar username={username} sx={{ width: 40, height: 40, fontSize: 20 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'neutral.main', fontFamily: 'Inter, Helvetica Neue, sans-serif' }}>
          {username}
        </Typography>
      </Box>
      <NavList>
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <li key={tab.label} style={{ position: 'relative' }}>
              <NavItemBox>
                <NavItem to={tab.path} className={isActive ? 'active' : ''} end>
                  {tab.label}
                </NavItem>
                {isActive && <Underline />}
              </NavItemBox>
            </li>
          );
        })}
      </NavList>
    </NavContainer>
  );
};

export default PagesNavigation;
