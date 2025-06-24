import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Divider from '@/atoms/Divider'
import LoadingBox from '@/atoms/LoadingBox';
import { useAuth } from '@/utils/AuthContext';
import { searchByUser } from '@/utils/lists';
import { BooklistConstants } from '@/utils/constants';
import { handleSafeNavigation } from '@/utils/handlers';
import { useNotification } from '@/utils/NotificationContext';
import ListSection from '../components/ListSection';
import PagesNavigation from '@/components/NavigationTabs/PagesNavigation';
import UserAvatar from '@/atoms/UserAvatar';

function StartListButton() {
    const navigate = useNavigate();
    const { isAuth, handleSignin } = useAuth();

    function handleClick() {
        if (isAuth()) navigate('/list/new');
        else handleSignin();
    }

    return (
        <Button
          onClick={handleClick}
          variant="contained"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#b0bec5',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 500,
            px: 2,
            py: .5,
            fontSize: '0.95rem'
          }}
        >
            Crie sua própria lista
        </Button>
  );
}

function ListsPage() {
    const safeBack = handleSafeNavigation();
    const { username } = useParams();
    const { notify } = useNotification();
    const [ entries, setEntries ] =  useState([]);
    const [ loading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (!isNaN(Number(username)) || !username) {
            notify({
                message: 'Nome de usuário inválido!',
                severity: 'error'
            });
            
            setTimeout(() => safeBack(), 1500);
            return;
        }

        const fetchLists = async () => {
            try {
                const lists = await searchByUser(username);
                setEntries(lists);
                setIsLoading(false);
            } catch (error) {
                notify({
                    message: 'Erro ao carregar listas ou usuário não encontrado!',
                    severity: 'error'
                });
                setTimeout(() => {setIsLoading(false); safeBack();}, 1500);
            }
        };

        fetchLists();
    }, [username]);

    if (loading)
        return <LoadingBox />
     return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          

          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 4 }}>
            <Typography variant='h5' sx={{ alignSelf: 'center' }}>
                Descubra, organize e compartilhe seus livros favoritos criando listas personalizadas.
            </Typography>
            <StartListButton />
          </Box>

          <Box sx={{height: 20 }}>

         </Box>


         <PagesNavigation username={username} />


          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {entries && entries.length > 0 ? (
                entries
                  .filter(e => e.listName != BooklistConstants.DEFAULT_LIST_NAME)
                  .sort((a, b) => b?.books.length - a?.books.length)
                  .map((entry, index) => (
                    <ListSection key={index}
                        id={entry.id}
                        pathTo={`/${entry?.id}/list`}
                        title={entry?.listName}
                        items={entry?.books}
                        sx={{ mb: 2 }}
                    />
                ))
            ) : ( 
                <Typography variant="p" sx={{ mb: 2 }}>
                  Parece que ainda não há listas por {username}...
                </Typography>
            )}
          </Box>
        </Box>
        );
}

export default ListsPage;