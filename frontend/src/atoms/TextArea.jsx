import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';


const ReactiveInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'customHeight',
})(({ theme, customHeight }) => ({
  position: 'relative',
  display: 'flex',
  color: theme.palette.neutral.main,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  minHeight: customHeight || '2.5rem',
  fontSize: '0.9rem',
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.short,
    easing: theme.transitions.easing.easeInOut,
  }),

  '&:focus-within': {
    backgroundColor: theme.palette.neutral.secondary,
    color: theme.palette.background.default,
  },

  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5),
    width: '100%',
    height: '100%',
    resize: 'none',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    overflowY: 'auto',
    maxHeight: '400px',

    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#3f4e60',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
  },
}));

function TextArea({
  title,
  value,
  onChange,
  maxLength,
  multiline = false,
  customHeight,
  minRows = 4,
  maxRows = 12,
  InputProps,
  InputLabelProps,
  slotProps,
  ...props
}) {
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    onChange(newValue);
  };

  return (
    <Box>
      {title !== undefined && (
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
      )}

      <ReactiveInputBase
        fullWidth
        value={value}
        multiline={multiline}
        minRows={multiline ? minRows : undefined}
        maxRows={multiline ? maxRows : undefined}
        onChange={handleChange}
        customHeight={customHeight}
        {...InputProps}
        {...slotProps}
        {...props}
      />

      {maxLength !== undefined && (
        <Typography variant="caption" align="right" display="block">
          {value.length} / {maxLength}
        </Typography>
      )}
    </Box>
  );
}


export default TextArea;