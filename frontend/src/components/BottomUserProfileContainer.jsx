import React, { useEffect, useState } from 'react';
import BottomUserProfile from './BottomUserProfile';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import { checkFollowing, followUser, unfollowUser } from '../utils/followers';

const BottomUserProfileContainer = ({ profileUser }) => {
  const { user: loggedUser, handleSignin } = useAuth();
  const { notify } = useNotification();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileUserId, setProfileUserId] = useState(profileUser.id);

  // Busca o id do usuário pelo username, se necessário
  useEffect(() => {
    async function fetchUserId() {
      if (profileUser.username) {
        try {
          const res = await fetch(`/users/${profileUser.username}`);
          if (res.ok) {
            const data = await res.json();
            console.log('Fetched profile user ID:', data.id)
            setProfileUserId(data.id);
            ;
          }
        } catch (err) {
          setProfileUserId(undefined);
        }
      } else {
        setProfileUserId(profileUser.id);
      }
    }
    fetchUserId();
  }, [profileUser]);

  const isOwnProfile = loggedUser && profileUserId && loggedUser.username === profileUser.username;

  // Checa se está seguindo
  useEffect(() => {
    if (!loggedUser || !profileUserId || isOwnProfile) return;
    const followerId = parseInt(loggedUser.id);
    const followeeId = parseInt(profileUserId);
    const checkFollow = async () => {
      try {
        const following = await checkFollowing(followerId, followeeId);
        setIsFollowing(!!following);
      } catch (err) {
        setIsFollowing(false);
      }
    };
    checkFollow();
  }, [loggedUser, profileUserId, isOwnProfile]);

  // Seguir
  const handleFollow = async () => {
    if (!loggedUser) {
      handleSignin();
      return;
    }
    if (!profileUserId || isNaN(Number(profileUserId))) {
      notify({ message: 'Erro: usuário do perfil sem ID válido.', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      await followUser(parseInt(profileUserId));
      setIsFollowing(true);
      notify({ message: 'Agora você está seguindo este usuário!', severity: 'success' });
    } catch (e) {
      notify({ message: e.message || 'Erro ao seguir usuário', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Deixar de seguir
  const handleUnfollow = async () => {
    setLoading(true);
    try {
      await unfollowUser(parseInt(profileUserId));
      setIsFollowing(false);
      notify({ message: 'Você deixou de seguir este usuário.', severity: 'info' });
    } catch (e) {
      notify({ message: e.message || 'Erro ao deixar de seguir', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomUserProfile
      isOwnProfile={isOwnProfile}
      isFollowing={isFollowing}
      onFollow={handleFollow}
      onUnfollow={handleUnfollow}
      onLogin={handleSignin}
      loading={loading}
    />
  );
};

export default BottomUserProfileContainer;
