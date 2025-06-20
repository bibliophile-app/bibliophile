import React from 'react';
import styles from './QuoteCard.module.css';

const QuoteCard = ({ quote }) => {
  // Limita o texto a 255 caracteres
  const text = quote.content?.length > 255
    ? quote.content.slice(0, 252) + '...'
    : quote.content;

  return (
    <div className={styles.quoteCard}>
      <div className={styles.quoteContent}>
        <p className={styles.quoteText}>
          "{text}"
        </p>
      </div>
    </div>
  );
};

export default QuoteCard;