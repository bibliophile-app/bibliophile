package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.dao.id.EntityID

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Review
import com.bibliophile.models.ReviewRequest
import com.bibliophile.db.entities.ReviewDAO
import com.bibliophile.db.tables.ReviewsTable
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.suspendTransaction

object ReviewRepository {

    /** Retorna todas as reviews */
    suspend fun allReviews(): List<Review> = suspendTransaction {
        ReviewDAO.all().map(::daoToModel)
    }

    /** Busca uma review pelo ID */
    suspend fun review(id: Int): Review? = suspendTransaction {
        ReviewDAO.findById(id)?.let(::daoToModel)
    }

    /** Busca reviews por usuário */
    suspend fun getReviewsByUserId(userId: Int): List<Review> = suspendTransaction {
        ReviewDAO.find { ReviewsTable.userId eq userId }.map(::daoToModel)
    }

    /** Busca reviews por Book ID */
    suspend fun getReviewsById(bookId: String): List<Review> = suspendTransaction {
        ReviewDAO.find { ReviewsTable.bookId eq bookId }.map(::daoToModel)
    }

    /** Adiciona uma nova review e retorna a criada */
    suspend fun addReview(userId: Int, review: ReviewRequest): Review = suspendTransaction {
        ReviewDAO.new {
            this.userId = EntityID(userId, UsersTable)
            this.bookId = review.bookId
            this.content = review.content
            this.rate = review.rate
            this.favorite = review.favorite
            this.reviewedAt = review.reviewedAt 
        }.let(::daoToModel)
    }

    /** Atualiza uma review existente */
    suspend fun updateReview(reviewId: Int, userId: Int, review: ReviewRequest): Boolean = suspendTransaction {
        val reviewDAO = ReviewDAO.findById(reviewId)
        if (reviewDAO != null && reviewDAO.userId.value == userId) {
            reviewDAO.apply {
                bookId = review.bookId
                content = review.content
                rate = review.rate
                favorite = review.favorite
                reviewedAt = review.reviewedAt
            }
            true
        } else {
            false
        }
    }
        
    /** Deleta uma review pelo ID e ID do usuário */
    suspend fun deleteReview(reviewId: Int, userId: Int): Boolean = suspendTransaction {
        val reviewDAO = ReviewDAO.findById(reviewId)
        if (reviewDAO != null && reviewDAO.userId.value == userId) {
            reviewDAO.delete()
            true
        } else {
            false
        }
    }
    
}