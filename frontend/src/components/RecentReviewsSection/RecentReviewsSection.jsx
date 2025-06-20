import React from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '../ReviewCard/ReviewCard';
import styles from './RecentReviewsSection.module.css';

const RecentReviewsSection = ({ reviews }) => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>RECENT REVIEWS</h2>
        <Link to="/reviews" className={styles.moreLink}>MORE</Link>
      </div>
      <div className={styles.reviewsList}>
        {reviews.slice(0, 4).map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};

export default RecentReviewsSection;