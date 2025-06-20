import React from 'react';
import styles from './UserProfileHeader.module.css';
import { styled } from '@mui/material/styles';
import { Avatar } from '@mui/material';
import { useAuth } from '../../utils/AuthContext';
import { Link } from 'react-router-dom';
//import { useParams, Link as RouterLink } from 'react-router-dom';

const UserAvatar = styled(Avatar)(({ theme }) => ({
    display: 'flex',
    width: 60, // reduzido
    height: 60,
    borderRadius: '50%', // círculo perfeito
    backgroundColor: theme.palette.primary.main,
    flexShrink: 0,
    fontSize: 24, // ajustado para o novo tamanho
    alignItems: 'center',
    justifyContent: 'center',
}));

const UserProfileHeader = ({ user }) => {
  const { user: loggedUser } = useAuth();
  const { name, username, metrics = {} } = user;
  // Garante que todos os campos de métricas existem
  const safeMetrics = {
    booksRated: metrics.booksRated ?? 0,
    lists: metrics.lists ?? 0,
    following: metrics.following ?? 0,
    followers: metrics.followers ?? 0,
  };

  // Usa name se existir, senão username
  const displayName = name && name.length > 0 ? name : username;
  const routeUsername = username;
  const isOwnProfile = loggedUser && user && loggedUser.username === username;

  const renderActionButton = () => {
    if (isOwnProfile) {
      return <button className={styles.editProfileButton}>EDIT PROFILE</button>;
    } else {
      return <button className={styles.followButton}>FOLLOW</button>;
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.profileInfo}>
        <UserAvatar sx={{ color: 'neutral.main', bgcolor: 'primary.main' }}>
          {displayName && displayName.length > 0 ? displayName[0].toUpperCase() : '?'}
        </UserAvatar>
        <div className={styles.nameAndButton}>
          <h1 className={styles.userName}>{displayName}</h1>
          {renderActionButton()}
        </div>
      </div>
      <div className={styles.metrics}>
        <Link to={`/${routeUsername}/reviews`} className={styles.metricItem}>
          <span className={styles.metricValue}>{safeMetrics.booksRated}</span>
          <span className={styles.metricLabel}>LIVROS</span>
        </Link>
        <div className={styles.metricDivider} />
        <Link to={`/${routeUsername}/lists`} className={styles.metricItem}>
          <span className={styles.metricValue}>{safeMetrics.lists}</span>
          <span className={styles.metricLabel}>LISTAS</span>
        </Link>
        <div className={styles.metricDivider} />
        <Link to={`/${routeUsername}/following`} className={styles.metricItem}>
          <span className={styles.metricValue}>{safeMetrics.following}</span>
          <span className={styles.metricLabel}>FOLLOWINGS</span>
        </Link>
        <div className={styles.metricDivider} />
        <Link to={`/${routeUsername}/followers`} className={styles.metricItem}>
          <span className={styles.metricValue}>{safeMetrics.followers}</span>
          <span className={styles.metricLabel}>FOLLOWERS</span>
        </Link>
      </div>
    </div>
  );
};

export default UserProfileHeader;