import React from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import styles from './NavigationTabs.module.css';

const NavigationTabs = () => {
  const location = useLocation();
  const { username } = useParams();
  const { user: loggedUser } = useAuth();
  // username da URL, ou do logado se for o próprio perfil
  const routeUsername = username || loggedUser?.username;

  // Função para construir a rota correta
  const getUserRoute = (tab) => `/${routeUsername}/${tab}`;

  // Tabs que realmente existem
  const tabs = [
    { label: 'Perfil', path: getUserRoute('profile') },
    { label: 'Diário', path: getUserRoute('diary') },
    { label: 'Reviews', path: getUserRoute('reviews') },
    { label: 'Listas', path: getUserRoute('lists') },
  ];

  return (
    <nav className={styles.navContainer}>
      <ul className={styles.navList}>
        {tabs.map(tab => (
          <li key={tab.label}>
            <NavLink
              to={tab.path}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.activeTab : ''}`}
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationTabs;