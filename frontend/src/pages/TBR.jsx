import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useAuth } from '../utils/AuthContext';
import { searchDefault } from '../utils/lists';
import { handleSafeNavigation } from '../utils/handlers';
import { useNotification } from '../utils/NotificationContext';
import { addBook, removeBook } from '@/utils/lists';

import Divider from '../atoms/Divider';
import LoadingBox from '../atoms/LoadingBox';
import GridSection from '../components/GridSection';
import SearchAutocomplete from '../components/search/SearchAutocomplete';

function TBRPage() {
    const safeBack = handleSafeNavigation();
    const { user, isAuth } = useAuth();
    const { notify } = useNotification();

    const [ entry, setEntry ] =  useState([]);
    const [ loading, setIsLoading ] = useState(true);

    async function fetchTBRList() {
        try {
            const list = await searchDefault(user.username);
            setEntry(list);
        } catch (error) {
            notify({
                message: 'Erro ao carregar lista de livros!',
                severity: 'error'
            });
            setTimeout(() => safeBack(), 1500);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAdd(book) {
        try {
            await addBook(entry.id, book.id);
            await fetchTBRList();
            notify({ message: 'Livro adicionado com sucesso!', severity: 'success' });
        } catch (e) {
            notify({ message: 'Erro ao adicionar livro', severity: 'error' });
        }
    }

    async function handleRemove(book) {
        try {
            await removeBook(entry.id, book.id);
            await fetchTBRList();
            notify({ message: 'Livro removido com sucesso!', severity: 'success' });
        } catch (e) {
            notify({ message: 'Erro ao remover livro', severity: 'error' });
        }
    }

    useEffect(() => {
        setIsLoading(true);
        if (!user) return;

        if (!isAuth) {
            notify({
                message: 'Por favor, faça login para acessar sua lista de quero ler',
                severity: 'info',
            })
            safeBack();
            return;
        }

        fetchTBRList();
    }, [user]);


    if (loading)
        return <LoadingBox />
    else return (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
                <Box>
                    <Typography variant='body' sx={{ fontSize: '1rem', textTransform: 'lowercase' }}>
                        você quer ler {entry.books.length} livro{entry.books.length == 1 ? '' : 's'}
                    </Typography>
                </Box> 

                <Divider sx={{ my: 1 }}/>

                <GridSection items={entry.books} type='book' onSelect={handleRemove}/>
            </Box>

            <Box sx={{ width: '25%'}}>
                <Typography variant='body' sx={{ fontSize: '1rem', textTransform: 'lowercase' }}>
                    Adicione um livro
                </Typography>
                <Divider sx={{ my: 1 }}/>
                <SearchAutocomplete onSelect={handleAdd} placeholder={'Busque livros...'} />
            </Box>
        </Box>
    );
}

export default TBRPage;