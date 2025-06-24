import React from 'react';
import { Box, Typography } from '@mui/material';
import UserAvatar from '../atoms/UserAvatar';
import { Link as RouterLink } from 'react-router-dom';

function FollowerBox({ username, sx }) {
  return (
    <Box
      component={RouterLink}
      to={`/${username}/profile`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        textDecoration: 'none',
        marginBottom: "0.5px",
        transition: '0.2s',
        cursor: 'pointer',
        px: 2,
        py: 1,
        borderRadius: 2,
        color: '#FFFFFF',
        borderRadius: 1,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: '#0F151B',
        },
        ...sx
  
      }}
    >
      <UserAvatar username={username} />
      <Typography variant="body1" fontWeight="bold">
        {username}
      </Typography>
    </Box>
  );
}

export default FollowerBox;
