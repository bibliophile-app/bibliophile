import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Divider from '@/atoms/Divider'
import LoadingBox from '@/atoms/LoadingBox';
import { searchByUser } from '@/utils/lists';
import { handleSafeNavigation } from '@/utils/handlers';
import { useNotification } from '@/utils/NotificationContext';
import ListSection from '../components/ListSection';

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
    else return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Typography variant='span'>
                listas por
            </Typography>
            <Typography
                variant="span"
                color="neutral.main"
                fontWeight="bold"
                component={RouterLink}
                to={`${username}/profile/`}
                onClick={(e) => e.stopPropagation()}
            >
                {username}
            </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }}/>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {entries && entries.length > 0 ? (
                entries
                    .filter(e => e.listName != "___DEFAULT___")
                    .map((entry, index) => (
                        <ListSection key={index}
                            id={entry.id}
                            pathTo={`/${entry.id}/list`}
                            title={entry.listName}
                            items={entry?.items}
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