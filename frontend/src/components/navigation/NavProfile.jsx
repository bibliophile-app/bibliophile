import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import UserAvatar from '@/atoms/UserAvatar';
import { NavLink, useLocation } from 'react-router-dom';

const NavContainer = styled(Box)(({ theme, filled }) => ({
  background: 'none',
  border: '1px solid #334355DD',
  borderRadius: 3,
  backgroundColor: filled ? '#334355CC' : 'transparent',
  padding: '8px 20px',
  display: 'flex',
  alignItems: 'center',
  color: '#eee',
  width: '100%',
  margin: '0 auto 30px auto',
  boxShadow: '0 2px 12px 0 rgba(30,40,60,0.18), 0 1.5px 4px 0 rgba(30,40,60,0.10)',
  boxSizing: 'border-box',
  gap: theme.spacing(0),
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
  fontFamily: 'Inter, Helvetica Neue, sans-serif',
  fontSize: '1rem',
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
  backgroundColor: '#CFD8DC',
  borderRadius: 2,
}));

function ProfileNavigation({ username, filledBox=false , hiddenUser=false }) {
  const location = useLocation();
  const tabs = [
    { label: 'Perfil', path: `/${username}/profile` },
    { label: 'Resenhas', path: `/${username}/reviews` },
    { label: 'Diário', path: `/${username}/diary` },
    { label: 'Citações', path: `/${username}/quotes` },
    { label: 'Listas', path: `/${username}/lists` },
  ];

  return (
    <NavContainer filled={filledBox}>
      {!hiddenUser &&
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1 }}>
          <UserAvatar username={username} sx={{ width: 30, height: 30, fontSize: 15, boxShadow: '0 0 8px 4px rgba(0, 0, 0, 0.1)' }} />
          <Typography variant="h4" sx={{ fontWeight: 600, fontSize: 15, color: '#eee' }}>
            {username}
          </Typography>
        </Box>
      }
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

export default ProfileNavigation;