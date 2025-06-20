import React from 'react';
import { Link } from 'react-router-dom';
import QuoteCard from '../QuoteCard/QuoteCard';
import styles from './QuotesSection.module.css';

const QuotesSection = ({ quotes }) => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>FAVORITE QUOTES</h2>
        <Link to="/quotes" className={styles.moreLink}>MORE</Link>
      </div>
      <div className={styles.quotesGrid}>
        {quotes.slice(0, 4).map(quote => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
    </section>
  );
};

export default QuotesSection;