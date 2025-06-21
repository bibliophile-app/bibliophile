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
 */
const BottomUserProfile = ({ isOwnProfile, isFollowing, onFollow, onUnfollow, onLogin }) => {
  const { user } = useAuth();
  const [hover, setHover] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { notify } = useNotification ? useNotification() : { notify: () => {} };

  if (isOwnProfile) {
    return (
      <Button
        variant="contained"
        sx={{ height: 28, minHeight: 24, fontSize: '0.85rem', px: 1.5, py: 0.5, alignSelf: 'center', background: '#567', color: '#c8d4e0', borderRadius: '3px', '&:hover': { background: '#456' } }}
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
          sx={{ height: 28, minHeight: 24, fontSize: '0.85rem', px: 1.5, py: 0.5, alignSelf: 'center', background: '#567', color: '#c8d4e0', borderRadius: '3px', '&:hover': { background: '#456' } }}
          onClick={() => {
            setLoginOpen(true);
            if (onLogin) onLogin();
          }}
        >
          FOLLOW
        </Button>
        <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  return (
    <Button
      variant="contained"
      sx={{ height: 28, minHeight: 24, fontSize: '0.85rem', px: 1.5, py: 0.5, alignSelf: 'center', background: '#567', color: '#c8d4e0', borderRadius: '3px', '&:hover': { background: '#456' } }}
      onClick={isFollowing ? onUnfollow : onFollow}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isFollowing ? (hover ? 'UNFOLLOW' : 'FOLLOWING') : 'FOLLOW'}
    </Button>
  );
};

export default BottomUserProfile;
