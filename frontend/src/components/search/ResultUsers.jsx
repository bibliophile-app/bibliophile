import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import UserAvatar from '../../atoms/UserAvatar';
import FollowerBox from '../../atoms/FollowerBox';
import Divider from '../../atoms/Divider';
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
                Nenhum usuário encontrado.
            </Typography>
        );
    }

    return (
        <Box>
            {filtered.map((user, idx) => (
                <Box key={user.username}>
                    <FollowerBox username={user.username} />
                    <Divider sx={{ my: 1 , opacity: 0.5}} />
                </Box>
            ))}
        </Box>
    );
}

export default ResultUsers;
