import { Box, Stack, Typography } from '@mui/material';

function BookHeader({ title, year, authors }) {
  return (
    <Stack spacing={1}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        {year && (
          <Typography
            variant="h5"
            component="span"
            sx={{ fontWeight: 400, fontSize: '1.2rem', opacity: 0.8 }}
          >
            ({year})
          </Typography>
        )}
      </Box>
      {authors?.length > 0 && (
        <Typography sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
          Escrito por {authors}
        </Typography>
      )}
    </Stack>
  );
}

export default BookHeader;
