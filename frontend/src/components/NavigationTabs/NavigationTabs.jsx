import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, styled } from '@mui/material';

const NavContainer = styled(Box)(({ theme }) => ({
  background: 'none',
  border: '1px solid #334355',
  borderRadius: 3,
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#eee',
  width: '100%',
  maxWidth: 900,
  margin: '0 auto 30px auto',
  boxShadow: 'none',
  boxSizing: 'border-box',
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

const NavItemBox = styled(Box)(({ theme, active }) => ({
  position: 'relative',
  display: 'inline-block',
  padding: 0,
}));

const NavItem = styled(NavLink)(({ theme, active }) => ({
  color: active ? '#eee' : '#aaa',
  textDecoration: 'none',
  fontWeight: 400,
  fontFamily: 'Inter, Helvetica Neue, sans-serif',
  fontSize: '1.1rem',
  letterSpacing: 0,
  padding: '5px 0',
  transition: 'color 0.2s',
  position: 'relative',
  textTransform: 'none',
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

const NavigationTabs = ({ user }) => {
  const location = useLocation();
  const routeUsername = user?.username;
  const tabs = [
    { label: 'Perfil', path: `/${routeUsername}/profile` },
    { label: 'Resenhas', path: `/${routeUsername}/reviews` },
    { label: 'Diário', path: `/${routeUsername}/diary` },
    { label: 'Listas', path: `/${routeUsername}/lists` },
  ];

  return (
    <NavContainer>
      <NavList>
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <li key={tab.label} style={{ position: 'relative' }}>
              <NavItemBox>
                <NavItem to={tab.path} active={isActive ? 1 : 0} end>
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

export default NavigationTabs;