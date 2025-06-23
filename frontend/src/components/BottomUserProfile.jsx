import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import Login from './Login';

/**
 * Props:
 * - isOwnProfile: boolean
 * - isFollowing: boolean
 * - onFollow: () => Promise<void>
 * - onUnfollow: () => Promise<void>
 * - onLogin: () => void
 * - loading: boolean
 */
const BottomUserProfile = ({ isOwnProfile, isFollowing, onFollow, onUnfollow, onLogin, loading }) => {
  const { user } = useAuth();
  const [hover, setHover] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { notify } = useNotification ? useNotification() : { notify: () => {} };

  // Cores do tema
  const editFollowColor = '#567'; // cinza padrão
  const editFollowHover = '#456';
  const followingColor = '#00ac1c'; // green do MUITheme
  const unfollowColor = '#567'; // orange do MUITheme
  const textColor = '#f4fcf0';

  if (isOwnProfile) {
    return (
      <Button
        variant="contained"
        sx={{ height: 28, minHeight: 24, fontSize: '0.85rem', px: 1.5, py: 0.5, alignSelf: 'center', background: editFollowColor, color: textColor, borderRadius: '3px', '&:hover': { background: editFollowHover } }}
        disabled={loading}
      >
        EDITE O PERFIL
      </Button>
    );
  }

  if (!user) {
    return (
      <>
        <Button
          variant="contained"
          sx={{ height: 24, fontWeight: 'bold', fontSize: '0.75rem', px: 1.5, py: 0.5, alignSelf: 'center', background: editFollowColor, color: textColor, borderRadius: '3px', '&:hover': { background: editFollowHover } }}
          onClick={() => {
            setLoginOpen(true);
            if (onLogin) onLogin();
          }}
          disabled={loading}
        >
          FOLLOW
        </Button>
        <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  // Estilo dinâmico para o botão de follow/following/unfollow
  let bgColor = editFollowColor;
  let hoverColor = editFollowHover;
  if (isFollowing) {
    if (hover) {
      bgColor = unfollowColor;
      hoverColor = unfollowColor;
    } else {
      bgColor = followingColor;
      hoverColor = followingColor;
    }
  }

  return (
    <Button
      variant="contained"
      sx={{
        height: 24,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        px: 1.5,
        py: 0.5,
        alignSelf: 'center',
        background: bgColor,
        color: textColor,
        borderRadius: '3px',
        '&:hover': { background: hoverColor }
      }}
      onClick={isFollowing ? onUnfollow : onFollow}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={loading}
    >
      {isFollowing ? (hover ? 'UNFOLLOW' : 'FOLLOWING') : 'FOLLOW'}
    </Button>
  );
};

export default BottomUserProfile;
