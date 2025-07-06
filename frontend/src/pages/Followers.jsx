import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Divider from '../atoms/Divider';
import LoadingBox from '../atoms/LoadingBox';
import FollowerBox from '../atoms/FollowerBox';
import { useNotification } from '../utils/NotificationContext';
import { getFollowers } from '../utils/followers';
import { getUserById } from '../utils/users';

async function fetchUserIdByUsername(username) {
  const res = await fetch(`/users/${username}`);
  if (!res.ok) throw new Error('Usuário não encontrado');
  const user = await res.json();
  return user.id;
}

function FollowersPage() {
  const { username } = useParams();
  const { notify } = useNotification();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchUserIdByUsername(username)
      .then(userId => getFollowers(userId))
      .then(async (followersList) => {
        // Para cada follower, buscar o username do followerId
        const users = await Promise.all(
          followersList.map(async (f) => {
            try {
              const user = await getUserById(f.followerId);
              return { username: user.username };
            } catch {
              return null;
            }
          })
        );
        if (isMounted) setFollowers(users.filter(Boolean));
      })
      .catch(() => {
        notify({ message: 'Erro ao buscar seguidores!', severity: 'error' });
        if (isMounted) setFollowers([]);
      })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [username]);

  if (loading) return <LoadingBox />;

return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
                variant="p"
                sx={{ color: 'neutral.secondary' }}
        >
            SEGUIDORES DE{' '}
            <span
                style={{ color: 'inherit', cursor: 'pointer' }}
                onClick={() => navigate(`/${username}/profile`)}
                onMouseOver={e => (e.currentTarget.style.fontWeight = 'bold')}
                onMouseOut={e => (e.currentTarget.style.fontWeight = 'inherit')}
            >
                {username?.toUpperCase()}
            </span>
        </Typography>
        <Divider sx={{ borderColor: '#334355', mb: 2 }} />
        {followers.length === 0 ? (
            <Typography variant="body1" >
                Nenhum seguidor encontrado.
            </Typography>
        ) : (
            followers.map((f, idx) => (
                <React.Fragment key={f.username}>
                    {idx !== 0 && <Divider sx={{ my: 0.5 , opacity: 0.5}} />}
                    <FollowerBox username={f.username} />
                </React.Fragment>
            ))
        )}
    </Box>
);
}

export default FollowersPage;
