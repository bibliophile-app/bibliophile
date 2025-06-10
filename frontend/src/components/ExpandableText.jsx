import { useState } from 'react';
import { Typography } from '@mui/material';

const MAX_LENGTH = 300;

const ExpandableText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  const descText = typeof text === 'string'
    ? text
    : text?.value || '';

  const isLong = descText.length > MAX_LENGTH;
  const visibleText = expanded ? descText : descText.slice(0, MAX_LENGTH);

  const toggleExpanded = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <Typography variant="body1" sx={{ mt: 2, minHeight: '5vw' }}>
        {visibleText}
        {isLong && !expanded && '...'}
        {isLong && (
        <Typography
          variant="span"
          color="neutral.main"
          onClick={toggleExpanded} sx={{ p: 1, opacity: 0.5 }}
        >
          {expanded ? 'Ler Menos' : 'Ler Mais'}
        </Typography>
      )}
    </Typography>
  );
};

export default ExpandableText;
