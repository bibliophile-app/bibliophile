import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import UserAvatar from '../../atoms/UserAvatar';

const StyledItem = styled(Paper)(({ theme }) => ({
    display: 'flex',
    marginBottom: "10px",
    alignItems: 'center',
    backgroundColor: 'transparent',
    transition: '0.2s',
    color: theme.palette.white,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.background.surface,
    },
}));

function ResultUsers({ users, query }) {
    const navigate = useNavigate();
    console.log('users:', users, 'query:', query); // debug
    const filtered = users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));

    if (!filtered.length) {
        return (
            <Typography variant="body" fontSize={"0.8rem"}>
                NO USERS FOUND...
            </Typography>
        );
    }

    return filtered.map((user) => (
        <StyledItem key={user.id} elevation={1} onClick={() => navigate(`/${user.username}/profile`)}>
            <UserAvatar username={user.username} sx={{ width: 40, height: 40, fontSize: '1.2rem' }} />
            <Box sx={{ ml: 2 }}>
                <Typography variant="h6" fontWeight="bold" color='white' gutterBottom>
                    {user.username}
                </Typography>
            </Box>
        </StyledItem>
    ));
}

export default ResultUsers;
