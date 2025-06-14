import { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';

import TextArea from '@/atoms/TextArea';
import useOpenLibrary from '@/utils/useOpenLibrary';

function SearchAutocomplete({
  placeholder,
  onSelect,
}) {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);

  const { fetchResults, loading } = useOpenLibrary({
    onError: null
  });

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (input.trim().length === 0) {
        setOptions([]);
        return;
      }

      const options = await fetchResults(input);
      setOptions(options);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [input]);

  return (
    <Autocomplete
      fullWidth
      selectOnFocus
      disableClearable
      options={options}
      getOptionLabel={(option) => option?.title ?? ''}
      isOptionEqualToValue={(option, value) => option?.olid === value?.olid}
      inputValue={input}
      onInputChange={(_, value) => setInput(value)}
      onChange={(_, value) => value && onSelect(value)}
      noOptionsText={
          <Box>
            <Typography variant="body2" sx={{ color: 'neutral.main' }}>
              Nenhum livro encontrado.
            </Typography>
          </Box>
      }

      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'background.contrast',
            boxShadow: 'none',
            margin: 0,
            color: 'neutral.main',
            fontSize: '1rem',
          },
        },
        listbox: {
          sx: {
            padding: 0,
            maxHeight: 200,
            backgroundColor: 'background.contrast',
            '& .MuiAutocomplete-option': {
              gap: 1,
              padding: 1,
              minHeight: 'auto',
              alignItems: 'baseline',
              borderBottom: '1px solid #44515C',
              
              '&.Mui-focused, &.Mui-focused[aria-selected="true"]': {
                backgroundColor: 'success.main',
              },
            },
          },
        },
        popupIndicator: {
          sx: {
            color: 'inherit',
          },
        },
      }}
      renderInput={(params) => (
        <TextArea
          {...params}
          value={input}
          onChange={setInput}
          placeholder={placeholder}
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={16} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={({key, ...props}, option, { index }) => (
        <li key={option?.olid ?? index} {...props}>
          <Typography fontWeight="bold">
            {option.title}
          </Typography>
          <Typography variant="small">  
            {option.authors && ` (${option.authors})`}
          </Typography>
        </li>
      )}
    />
  );
}

export default SearchAutocomplete;
