import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';

import { searchByUser } from '@/utils/reviews';
import { handleSafeNavigation } from '@/utils/handlers';
import { useNotification } from '@/utils/NotificationContext';

import Divider from '@/atoms/Divider';
import LoadingBox from '@/atoms/LoadingBox';
import ReviewCard from '@/components/reviews/ReviewCard';
import NavProfile from '@/components/navigation/NavProfile';

function DiaryReviewCard({ entry }) {
  const day = new Date(entry.reviewedAt + 'T00:00:00').getDate();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box 
        sx={{ width: 60, height: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography variant="h3" sx={{ userSelect: 'none' }}>
          {day}
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        <ReviewCard
          review={entry}
          displayDate={false}
          displayOwner={false}
          displayContent={false}
          displayBookDetails={true}
        />
      </Box>
    </Box>
  );
}

function DiaryPage() {
  const safeBack = handleSafeNavigation();
  const { username } = useParams();
  const { notify } = useNotification();

  const [entries, setEntries] = useState([]);
  const [loading, setIsLoading] = useState(true);
 
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

    async function fetchReviews() {
      try {
        const reviews = await searchByUser(username);
        setEntries(reviews);
        setIsLoading(false);
      } catch (error) {
        notify({
          message: 'Erro ao carregar avaliações ou usuário não encontrado!',
          severity: 'error'
        });
        setTimeout(() => {setIsLoading(false); safeBack()}, 1500);
      }
    };

    fetchReviews();
  }, [username, notify]);

  function groupEntriesByMonth(entries) {
    return entries?.reduce((acc, entry) => {
      const date = new Date(entry.reviewedAt);
      const year = date.getFullYear();
      const monthNum = String(date.getMonth() + 1).padStart(2, '0');
      const sortKey = `${year}-${monthNum}`;
      const monthLabel = `${date.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
      
      if (!acc[monthLabel]) {
        acc[monthLabel] = { entries: [], sortKey };
      }

      acc[monthLabel].entries.push(entry);
      return acc;
    }, {});
  }

  const groupedByMonth = groupEntriesByMonth(entries);

  Object.values(groupedByMonth || []).forEach(({ entries }) => {
    entries.sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));
  });

  const sortedMonths = Object.entries(groupedByMonth || {})
    .sort(([, a], [, b]) => new Date(b.sortKey + '-01') - new Date(a.sortKey + '-01'))
    .map(([monthLabel]) => monthLabel);

  if (loading)
    return <LoadingBox />;
  else return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <NavProfile username={username} filledBox />

      {entries && entries.length > 0 ? (
        sortedMonths.map((month) => (
          <div key={month}>
            <Typography variant="h4" sx={{ p: 1, my: 1, bgcolor: 'background.muted'}}>
              {month}
            </Typography>
            
            {groupedByMonth[month].entries.map((entry, index) => (
              <React.Fragment key={entry.id}>
                {index !== 0 && <Divider sx={{ opacity: 0.5, my: 1 }} />}
                <DiaryReviewCard entry={entry} />
              </React.Fragment>
            ))}
          </div>
        ))
      ) : ( 
        <Typography variant="p" sx={{ mb: 2 }}>
          Parece que ainda não há registros no diário de {username}...
        </Typography>
      )}
    </Box>
  );
}

export default DiaryPage;