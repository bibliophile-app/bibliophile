import React from 'react';
import styles from './QuoteCard.module.css';

const QuoteCard = ({ quote }) => {
  return (
    <div className={styles.quoteCard}>
      <div className={styles.quoteContent}>
        <p className={styles.quoteText}>
          "{quote.content}"
        </p>
      </div>
    </div>
  );
};

export default QuoteCard;