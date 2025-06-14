import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';

import { searchById } from '../utils/lists';
import { useAuth } from '../utils/AuthContext';
import { handleShare, handleSafeNavigation } from '../utils/handlers';
import { useNotification } from '../utils/NotificationContext';

import Divider from '../atoms/Divider';
import LoadingBox from '../atoms/LoadingBox';
import GridSection from '../components/GridSection';

function Tools({ listOwner, handleList, notify }) {
    const { user } = useAuth();

    return (
        <Box sx={{ display: 'flex', ml: 'auto', justifyContent: 'center' }}> 
            <IconButton onClick={() => handleShare(notify)}>
                <ShareIcon sx={{ color: 'neutral.main', fontSize: '1.25rem' }} />
            </IconButton>

            { listOwner == user?.username && (
                <IconButton onClick={handleList}>
                    <EditIcon sx={{ color: 'neutral.main', fontSize: '1.25rem' }} />
                </IconButton>
            )}
        </Box>
    )
}

function ListPage() {
    const navigate = useNavigate();
    const safeBack = handleSafeNavigation();
    
    const { id } = useParams();
    const { notify } = useNotification();
    const [ entry, setEntry ] =  useState([]);
    const [ loading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        const fetchList = async () => {
            try {
                const list = await searchById(id, true);
                setEntry(list);
                setIsLoading(false);
            } catch (error) {
                notify({
                    message: 'Erro ao carregar lista de livros!',
                    severity: 'error'
                });
                setTimeout(() => {setIsLoading(false); safeBack();}, 1500);
            }
        };

        fetchList();
    }, [id]);

    if (loading)
        return <LoadingBox />
    else return (
    <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Typography variant='span'>
                lista por
            </Typography>

            <Typography
                variant="span"
                color="neutral.main"
                fontWeight="bold"
                component={RouterLink}
                to={`${entry.username}/profile/`}
                onClick={(e) => e.stopPropagation()}
            >
                {entry.username}
            </Typography>
        
            <Tools listOwner={entry.username} handleList={() => navigate(`/${id}/list/edit`)} notify={notify} />
        </Box> 

        <Divider sx={{ my: 1 }}/>

        <GridSection 
            title={entry.listName} 
            description={entry.listDescription} 
            items={entry.books} 
            type='book'
        />
    </Box>
    );
}

export default ListPage;