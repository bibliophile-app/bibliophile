import React from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Avatar, Paper } from '@mui/material';

const StyledItem = styled(Paper)(({ theme }) => ({
    display: 'flex',
    marginBottom: "10px",
    alignItems: 'center',
    backgroundColor: 'transparent',
    transition: '0.2s',
    color: theme.palette.white,
    borderRadius: theme.shape.borderRadius,
  
    '&:hover': {
      backgroundColor: theme.palette.background.surface,
    },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
    display: 'flex',
    width: 35,
    height: 35,
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
    flexShrink: 0,
    fontSize: 18
}));

function ResultUsers({ users }) {
    const navigate = useNavigate();
    function onSelect(user) {
        navigate(`/user/${user.username}`);
    };

    return !users.length ? (
            <Typography mt={4}>
              NO USERS FOUND
            </Typography>           
        ) : ( 
            users.map((user, _) => (
                <StyledItem key={user.username} elevation={1} onClick={() => onSelect(user)}>
                    <UserAvatar>
                        {(user.username && user.username.length > 0)
                                ? user.username[0].toUpperCase()
                                : '?'}
                    </UserAvatar>

                    <Box sx={{ ml: 2 }}>
                        <Typography variant="h5" fontWeight="bold" color='white' gutterBottom>
                            {user.username}
                        </Typography>
                    </Box>
                </StyledItem>
          ))
        )
}

export default ResultUsers;