import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import Divider from '@/atoms/Divider'
import LoadingBox from '@/atoms/LoadingBox';
import { searchByUser } from '@/utils/reviews';
import { handleSafeNavigation } from '@/utils/handlers';
import { useNotification } from '@/utils/NotificationContext';
import ReviewCard from '@/components/reviews/ReviewCard';
import NavProfile from '@/components/navigation/NavProfile';

function ReviewsPage() {
    const safeBack = handleSafeNavigation();
    const { username } = useParams();
    const { notify } = useNotification();
    const [ entries, setEntries ] =  useState([]);
    const [ loading, setIsLoading ] = useState(true);

    useEffect(() => {
        if (!isNaN(Number(username)) || !username) {
            notify({
                message: 'Nome de usuário inválido!',
                severity: 'error'
            });
            
            setTimeout(() => safeBack(), 1500);
            return;
        }

        setIsLoading(true);

        const fetchReviews = async () => {
            try {
                const reviews = await searchByUser(username);
                setEntries(reviews);
                setIsLoading(false);
            } catch (error) {
                notify({
                    message: 'Erro ao carregar resenhas ou usuário não encontrado!',
                    severity: 'error'
                });
                setTimeout(() => {setIsLoading(false); safeBack();}, 1500);
            }
        };

        fetchReviews();
    }, [username]);

    if (loading)
        return <LoadingBox />
    else return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <NavProfile username={username} />
        
        {entries && entries.filter(e => e.content).length > 0 ? (
            entries
                .filter(e => e.content)
                .map((entry, index) => (
                    <React.Fragment key={entry.id}>
                        {index !== 0 && <Divider sx={{ opacity: 0.5, my: 1 }} />}
                        <ReviewCard
                            review={entry}
                            displayDate={true}
                            displayOwner={false}
                            displayContent={true}
                            displayBookDetails={true}
                        />
                </React.Fragment>
            ))
        ) : ( 
            <Typography variant="p" sx={{ mb: 2 }}>
                Parece que ainda não há resenhas escritas por {username}...
            </Typography>
        )}
      </Box>
    );
}

export default ReviewsPage;