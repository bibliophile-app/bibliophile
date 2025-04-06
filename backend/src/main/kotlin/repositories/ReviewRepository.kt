package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Review
import com.bibliophile.db.entities.ReviewDAO
import com.bibliophile.db.tables.ReviewsTable
import com.bibliophile.db.suspendTransaction

class ReviewRepository {

    /** Retorna todas as reviews */
    suspend fun getAllReviews(): List<Review> = suspendTransaction {
        ReviewDAO.all().map(::daoToModel)
    }

    /** Busca uma review pelo ID */
    suspend fun getReviewById(id: Int): Review? = suspendTransaction {
        ReviewDAO.findById(id)?.let(::daoToModel)
    }

    /** Busca reviews por usuário */
    suspend fun getReviewsByUserId(userId: Int): List<Review> = suspendTransaction {
        ReviewDAO.find { ReviewsTable.userId eq userId }.map(::daoToModel)
    }

    /** Busca reviews por ISBN */
    suspend fun getReviewsByIsbn(isbn: String): List<Review> = suspendTransaction {
        ReviewDAO.find { ReviewsTable.isbn eq isbn }.map(::daoToModel)
    }

    /** Adiciona uma nova review e retorna a criada */
    suspend fun addReview(review: Review): Review = suspendTransaction {
        ReviewDAO.new {
            this.isbn = review.isbn
            this.userId = review.userId
            this.content = review.content
            this.rate = review.rate
            this.favorite = review.favorite
        }.let(::daoToModel)
    }

    /** Atualiza uma review existente */
    suspend fun updateReview(review: Review): Boolean = suspendTransaction {
        val reviewDAO = ReviewDAO.findById(review.id!!)
        if (reviewDAO != null) {
            reviewDAO.apply {
                isbn = review.isbn
                userId = review.userId
                content = review.content
                rate = review.rate
                favorite = review.favorite
            }
            true
        } else {
            false
        }
    }

    /** Deleta uma review pelo ID */
    suspend fun deleteReviewById(id: Int): Boolean = suspendTransaction {
        val deletedRows = ReviewsTable.deleteWhere { ReviewsTable.id eq id }
        deletedRows > 0
    }

    /** Deleta todas as reviews de um usuário */
    suspend fun deleteReviewsByUserId(userId: Int): Boolean = suspendTransaction {
        val deletedRows = ReviewsTable.deleteWhere { ReviewsTable.userId eq userId }
        deletedRows > 0
    }

    /** Deleta todas as reviews de um livro (ISBN) */
    suspend fun deleteReviewsByIsbn(isbn: String): Boolean = suspendTransaction {
        val deletedRows = ReviewsTable.deleteWhere { ReviewsTable.isbn eq isbn }
        deletedRows > 0
    }
    
}