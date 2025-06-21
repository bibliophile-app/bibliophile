import React, { useEffect, useState } from 'react';
import BottomUserProfile from './BottomUserProfile';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';

const API_URL = '/followers';

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
            console.log(data);
            setProfileUserId(data.id);
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

    const followerId = parseInt(loggedUser.id);
    const followeeId = parseInt(profileUserId);
    const checkFollow = async () => {
      try {
        const res = await fetch(`/followers/check?followerId=${followerId}&followeeId=${followeeId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setIsFollowing(!!data.isFollowing);
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
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ followeeId: parseInt(profileUserId) })
      });
      const text = await res.text();
      if (!res.ok && res.status !== 409) throw new Error(text || 'Erro ao seguir usuário');
      setIsFollowing(true);
      notify({ message: res.status === 409 ? 'Você já segue este usuário.' : 'Agora você está seguindo este usuário!', severity: res.status === 409 ? 'info' : 'success' });
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
      const res = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ followeeId: parseInt(profileUserId) })
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || 'Erro ao deixar de seguir usuário');
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
