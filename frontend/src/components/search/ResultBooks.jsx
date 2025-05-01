import { Box, Typography, Avatar, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
  
const StyledItem = styled(Paper)(({ theme }) => ({
    display: 'flex',
    marginBottom: "10px",
    alignItems: 'center',
    backgroundColor: 'transparent',
    transition: '0.2s',
    color: theme.palette.white,
    borderRadius: theme.shape.borderRadius,
  
    '&:hover': {
      backgroundColor: theme.palette.background.surface,
    },
}));
  
const BookCover = styled(Avatar)({
    width: 64,
    height: 96,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    flexShrink: 0,
});

function ResultBooks({ books, paginatedBooks }) {
    return !books.length ? (
        <Typography mt={4}>
          NO RESULTS FOUND
        </Typography>           
    ) : ( 
        paginatedBooks.map((book, index) => (
            <StyledItem key={index} elevation={1}>
                <BookCover variant="square" src={book.coverUrl} alt={book.title}>
                    N/A
                </BookCover>

                <Box sx={{ ml: 2 }}>
                    <Typography variant="h7" fontWeight="bold" color='white' gutterBottom>
                        {book.title}
                    </Typography>
                    <Typography variant="body2">
                        {book.author}
                    </Typography>
                </Box>
            </StyledItem>
      ))
    )
};

export default ResultBooks;