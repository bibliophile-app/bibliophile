package com.bibliophile.services

import io.ktor.http.*
import java.sql.SQLException
import com.bibliophile.models.Review
import com.bibliophile.repositories.ReviewRepository

class ReviewService(private val reviewRepository: ReviewRepository) {

    suspend fun getAllReviews(): List<Review> = reviewRepository.getAllReviews()

    suspend fun getReviewById(id: Int?): Pair<HttpStatusCode, Any> {
        if (id == null) return HttpStatusCode.BadRequest to "Review ID is required"
        val review = reviewRepository.getReviewById(id)
        return review?.let { HttpStatusCode.OK to it } ?: HttpStatusCode.NotFound to "Review not found"
    }

    suspend fun getReviewsByUserId(userId: Int?): Pair<HttpStatusCode, Any> {
        if (userId == null) return HttpStatusCode.BadRequest to "User ID is required"
        val reviews = reviewRepository.getReviewsByUserId(userId)
        return HttpStatusCode.OK to reviews
    }

    suspend fun getReviewsByIsbn(isbn: String?): Pair<HttpStatusCode, Any> {
        if (isbn.isNullOrBlank()) return HttpStatusCode.BadRequest to "ISBN is required"
        val reviews = reviewRepository.getReviewsByIsbn(isbn)
        return HttpStatusCode.OK to reviews
    }

    suspend fun addReview(review: Review): Pair<HttpStatusCode, String> {
        return try {
            validateReviewFields(review)?.let { return it }
            reviewRepository.addReview(review)
            HttpStatusCode.Created to "Review created successfully"
        } catch (ex: SQLException) {
            if (ex.message?.contains("unique constraint") == true) {
                HttpStatusCode.Conflict to "User already has a review for this book"
            } else {
                HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
            }
        } catch (ex: Exception) {
            HttpStatusCode.BadRequest to "Error creating review: ${ex.message}"
        }
    }

    suspend fun updateReview(review: Review): Pair<HttpStatusCode, String> {
        if (review.id == null) return HttpStatusCode.BadRequest to "Review ID is required"
        return try {
            validateReviewFields(review)?.let { return it }
            val updated = reviewRepository.updateReview(review)
            if (updated) {
                HttpStatusCode.OK to "Review updated successfully"
            } else {
                HttpStatusCode.NotFound to "Review not found"
            }
        } catch (ex: SQLException) {
            handleSQLException(ex)
        } catch (ex: Exception) {
            HttpStatusCode.BadRequest to "Error updating review: ${ex.message}"
        }
    }

    suspend fun deleteReviewById(id: Int?): Pair<HttpStatusCode, String> {
        if (id == null) return HttpStatusCode.BadRequest to "Review ID is required"
        return try {
            if (reviewRepository.deleteReviewById(id)) {
                HttpStatusCode.OK to "Review deleted successfully"
            } else {
                HttpStatusCode.NotFound to "Review not found"
            }
        } catch (ex: SQLException) {
            handleSQLException(ex)
        } catch (ex: Exception) {
            HttpStatusCode.InternalServerError to "Error deleting review: ${ex.message}"
        }
    }

    suspend fun deleteReviewsByUserId(userId: Int?): Pair<HttpStatusCode, String> {
        if (userId == null) return HttpStatusCode.BadRequest to "User ID is required"
        return try {
            if (reviewRepository.deleteReviewsByUserId(userId)) {
                HttpStatusCode.OK to "All user reviews deleted"
            } else {
                HttpStatusCode.NotFound to "No reviews found for user"
            }
        } catch (ex: SQLException) {
            handleSQLException(ex)
        }
    }

    suspend fun deleteReviewsByIsbn(isbn: String?): Pair<HttpStatusCode, String> {
        if (isbn == null) {
            return HttpStatusCode.BadRequest to "ISBN inválido."
        }
    
        val success = reviewRepository.deleteReviewsByIsbn(isbn)
        return if (success) {
            HttpStatusCode.OK to "Todas as reviews com o ISBN $isbn foram deletadas."
        } else {
            HttpStatusCode.NotFound to "Nenhuma review encontrada com o ISBN $isbn."
        }
    }

    private fun validateReviewFields(review: Review): Pair<HttpStatusCode, String>? {
        return when {
            review.content.isBlank() -> HttpStatusCode.BadRequest to "Review content cannot be empty"
            review.rate !in 1..5 -> HttpStatusCode.BadRequest to "Rating must be between 1 and 5"
            review.isbn.isBlank() -> HttpStatusCode.BadRequest to "ISBN is required"
            else -> null
        }
    }

    private fun handleSQLException(ex: SQLException): Pair<HttpStatusCode, String> {
        return if (ex.message?.contains("constraint") == true) {
            HttpStatusCode.Conflict to "Database constraint violation"
        } else {
            HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
        }
    }
    
}