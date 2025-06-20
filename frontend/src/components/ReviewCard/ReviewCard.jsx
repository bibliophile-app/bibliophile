import React from 'react';
import styles from './ReviewCard.module.css';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<span key={i} className={styles.starFilled}>★</span>);
    } else {
      stars.push(<span key={i} className={styles.starEmpty}>★</span>);
    }
  }
  return <div className={styles.starRating}>{stars}</div>;
};

const ReviewCard = ({ review }) => {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewContent}>
        <h3 className={styles.bookTitle}>Livro ID: {review.bookId}</h3>
        <div className={styles.reviewMeta}>
          <StarRating rating={review.rate} />
          {review.favorite && <span className={styles.favorite}>★ Favorito</span>}
        </div>
        <p className={styles.reviewText}>{review.content}</p>
        <div className={styles.username}>por {review.username}</div>
      </div>
    </div>
  );
};

export default ReviewCard;