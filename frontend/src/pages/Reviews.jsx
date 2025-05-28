import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { searchByUser } from '../components/reviews/utils';
import ReviewCard from '../components/reviews/ReviewCard';
import Divider from '../atoms/Divider'
import LoadingBox from '../atoms/LoadingBox';

function ReviewsPage() {
    const { username } = useParams();
    const [ entries, setEntries ] =  useState([]);
    const [ loading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        const fetchReviews = async () => {
        try {
            const reviews = await searchByUser(username);
            setEntries(reviews);
        } catch (error) {
            // feedback visual de erro
        } finally {
            setIsLoading(false);
        }
        };

        fetchReviews();
    }, [username]);

    if (loading)
        return <LoadingBox />
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{display: 'flex', gap: 0.5}}>
            <Typography variant='body2'>
                Reviews by 
            </Typography>
            <Typography
                variant="body2"
                fontWeight="bold"
                component={RouterLink}
                to={`${username}/profile/`}
                onClick={(e) => e.stopPropagation()}
            >
                {username}
            </Typography>
        </Box>
        
        {entries.filter(e => e.content).map((entry, _) => (
            <React.Fragment key={entry.id}>
                <Divider sx={{ opacity: 0.5, my: 1 }} />
                <ReviewCard
                    review={entry}
                    displayDate={true}
                    displayOwner={false}
                    displayContent={true}
                    displayBookDetails={true}
                />
            </React.Fragment>
        ))}
      </Box>
    );
}

export default ReviewsPage;