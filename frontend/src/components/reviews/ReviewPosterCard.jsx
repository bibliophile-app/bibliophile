import { Box, Typography, Stack } from '@mui/material';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';

import Rating from '../../atoms/Rating';
import UserAvatar from '../../atoms/UserAvatar';
import PosterCard from '../PosterCard';

function ReviewPosterCard({ review }) {
  const { username, rate, content, reviewedAt, bookId } = review;

  return (
    <Box sx={{ width: 160 }}>
      <PosterCard
        bookId={bookId}
        overlay={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <UserAvatar username={username} sx={{ width: '1rem', height: '1rem', fontSize: '.6rem' }}/>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
              {username}
            </Typography>
          </Stack>
        }
      />

      {/* Rating e data fora da imagem */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mx: 0.5 }}
        
        spacing={0.5}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5}}>
          <Rating
            value={rate / 2}
            readOnly
            size="small"
            precision={0.5}
            sx={{ pt: 0.5, fontSize: '0.8rem', color: 'background.muted' }}
          />
          {content && (
            <FormatAlignJustifyIcon
              sx={{ pt: 0.5, fontSize: '0.8rem', color: 'background.muted' }}
            />
          )}
        </Box>
        <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>
          {new Date(reviewedAt + 'T00:00:00').toLocaleDateString('pt-BR', {
            month: 'short',
            day: '2-digit',
          })}
        </Typography>
      </Stack>
    </Box>
  );
}

export default ReviewPosterCard;
