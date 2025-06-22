import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import UserAvatar from '../../atoms/UserAvatar';

const StyledItem = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  boxShadow: 'none',
}));

const ListTitle = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  fontWeight: 600,
  color: theme.palette.common.white,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const Username = styled(Typography)(({ theme }) => ({
  color: theme.palette.neutral.main,
  fontSize: '0.85rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const BookCount = styled(Typography)(({ theme }) => ({
  color: theme.palette.neutral.main,
  fontSize: '0.85rem',
  opacity: 0.7,
  marginLeft: theme.spacing(0.5),
}));

function ResultBooklists({ lists }) {
  const navigate = useNavigate();

  if (!lists || lists.length === 0) {
    return <Typography variant="body2">Nenhuma lista encontrada.</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" gap={0}>
      {lists.map((list, idx) => (
        <React.Fragment key={list.id}>
          <StyledItem>
            <ListTitle
              variant="h4"
              onClick={() => navigate(`/${list.id}/list`)}
            >
              {list.listName}
            </ListTitle>
            <UserInfo>
              <UserAvatar
                username={list.username || 'U'}
                sx={{ width: 20, height: 20, fontSize: '0.8rem' }}
              />
              <Username
                onClick={() => navigate(`/${list.username}/profile`)}
              >
                {list.creatorName || list.username || 'Usuário desconhecido'}
              </Username>
              <BookCount>
                {list.books ? `${list.books.length} livros` : '0 livros'}
              </BookCount>
            </UserInfo>
          </StyledItem>
          {idx < lists.length - 1 && <Divider sx={{ my: 0.5 }} />}
        </React.Fragment>
      ))}
    </Box>
  );
}

export default ResultBooklists;
