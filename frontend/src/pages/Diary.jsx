import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useAuth } from '../utils/AuthContext';
import { searchByUser } from '../components/reviews/utils';
import ReviewCard from '../components/reviews/ReviewCard';
import Divider from '../atoms/Divider'

function DiaryReviewCard({ entry }) {
  const day = new Date(entry.reviewedAt).getDate();

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
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
    const { user } = useAuth();
    const [ entries, setEntries ] =  useState([]);

    useEffect(() => {
        // setIsLoading(true);

        const fetchReviews = async () => {
        try {
            const reviews = await searchByUser(user.id);
            setEntries(reviews);
        } catch (error) {
            // feedback visual de erro
        } finally {
            // setIsLoading(false);
        }
        };

        fetchReviews();
    }, [user]);


    function groupEntriesByMonth(entries) {
        return entries.reduce((acc, entry) => {
            const date = new Date(entry.reviewedAt);
            const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            acc[monthKey] = acc[monthKey] || [];
            acc[monthKey].push(entry);
            return acc;
        }, {});
    }

    const groupedByMonth = groupEntriesByMonth(entries);
    
    Object.values(groupedByMonth).forEach(monthEntries => {
      monthEntries.sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));
    });

    const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
      const dateA = new Date(`${a} 1`);
      const dateB = new Date(`${b} 1`);
      return dateB - dateA;
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {sortedMonths.map((month) => (
          <div key={month}>
            <Typography variant="h6">{month}</Typography>
            {groupedByMonth[month].map((entry, author_name) => (
              <React.Fragment key={entry.id}>
                <Divider sx={{ opacity: 0.5, my: 1 }} />
                <DiaryReviewCard entry={entry} />
              </React.Fragment>
            ))}
          </div>
        ))}
      </Box>
    );
}

export default DiaryPage;