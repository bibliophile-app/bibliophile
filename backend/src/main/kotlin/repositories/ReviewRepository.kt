package com.bibliophile.repositories

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.dao.id.EntityID
import java.time.LocalDate

import com.bibliophile.models.Review
import com.bibliophile.models.ReviewRequest
import com.bibliophile.db.entities.ReviewDAO
import com.bibliophile.db.tables.ReviewsTable
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.suspendTransaction

object ReviewRepository {
    /** Retorna todas as reviews com informações dos usuários */
    suspend fun all(): List<Review> = suspendTransaction {
        (ReviewsTable innerJoin UsersTable)
            .slice(
                ReviewsTable.id,
                ReviewsTable.bookId,
                UsersTable.username,
                ReviewsTable.content,
                ReviewsTable.rate,
                ReviewsTable.favorite,
                ReviewsTable.reviewedAt
            )
            .selectAll()
            .map { row ->
                Review(
                    id = row[ReviewsTable.id].value,
                    bookId = row[ReviewsTable.bookId],
                    username = row[UsersTable.username],
                    content = row[ReviewsTable.content],
                    rate = row[ReviewsTable.rate],
                    favorite = row[ReviewsTable.favorite],
                    reviewedAt = row[ReviewsTable.reviewedAt]
                )
            }
    }

    /** Busca uma review pelo ID com informações do usuário */
    suspend fun findById(id: Int): Review? = suspendTransaction {
        (ReviewsTable innerJoin UsersTable)
            .slice(
                ReviewsTable.id,
                ReviewsTable.bookId,
                UsersTable.username,
                ReviewsTable.content,
                ReviewsTable.rate,
                ReviewsTable.favorite,
                ReviewsTable.reviewedAt
            )
            .select { ReviewsTable.id eq id }
            .singleOrNull()
            ?.let { row ->
                Review(
                    id = row[ReviewsTable.id].value,
                    bookId = row[ReviewsTable.bookId],
                    username = row[UsersTable.username],
                    content = row[ReviewsTable.content],
                    rate = row[ReviewsTable.rate],
                    favorite = row[ReviewsTable.favorite],
                    reviewedAt = row[ReviewsTable.reviewedAt]
                )
            }
    }

    /** Busca reviews por usuário com informações do usuário */
    suspend fun findByUserId(userId: Int): List<Review> = suspendTransaction {
        (ReviewsTable innerJoin UsersTable)
            .slice(
                ReviewsTable.id,
                ReviewsTable.bookId,
                UsersTable.username,
                ReviewsTable.content,
                ReviewsTable.rate,
                ReviewsTable.favorite,
                ReviewsTable.reviewedAt
            )
            .select { ReviewsTable.userId eq userId }
            .map { row ->
                Review(
                    id = row[ReviewsTable.id].value,
                    bookId = row[ReviewsTable.bookId],
                    username = row[UsersTable.username],
                    content = row[ReviewsTable.content],
                    rate = row[ReviewsTable.rate],
                    favorite = row[ReviewsTable.favorite],
                    reviewedAt = row[ReviewsTable.reviewedAt]
                )
            }
    }

    /** Busca reviews por livro com informações do usuário */
    suspend fun findByBookId(bookId: String): List<Review> = suspendTransaction {
        (ReviewsTable innerJoin UsersTable)
            .slice(
                ReviewsTable.id,
                ReviewsTable.bookId,
                UsersTable.username,
                ReviewsTable.content,
                ReviewsTable.rate,
                ReviewsTable.favorite,
                ReviewsTable.reviewedAt
            )
            .select { ReviewsTable.bookId eq bookId }
            .map { row ->
                Review(
                    id = row[ReviewsTable.id].value,
                    bookId = row[ReviewsTable.bookId],
                    username = row[UsersTable.username],
                    content = row[ReviewsTable.content],
                    rate = row[ReviewsTable.rate],
                    favorite = row[ReviewsTable.favorite],
                    reviewedAt = row[ReviewsTable.reviewedAt]
                )
            }
    }

    /** Adiciona uma nova review */
    suspend fun add(userId: Int, request: ReviewRequest): Review = suspendTransaction {
        val reviewDAO = ReviewDAO.new {
            this.userId = EntityID(userId, UsersTable)
            this.bookId = request.bookId
            this.content = request.content
            this.rate = request.rate
            this.favorite = request.favorite
            this.reviewedAt = request.reviewedAt
        }

        val username = (UsersTable)
            .slice(UsersTable.username)
            .select { UsersTable.id eq userId }
            .single()[UsersTable.username]

        Review(
            id = reviewDAO.id.value,
            bookId = reviewDAO.bookId,
            username = username,
            content = reviewDAO.content,
            rate = reviewDAO.rate,
            favorite = reviewDAO.favorite,
            reviewedAt = reviewDAO.reviewedAt
        )
    }

    /** Atualiza uma review existente */
    suspend fun update(id: Int, userId: Int, request: ReviewRequest): Boolean = suspendTransaction {
        val reviewDAO = ReviewDAO.findById(id)
        if (reviewDAO != null && reviewDAO.userId.value == userId) {
            reviewDAO.apply {
                bookId = request.bookId
                content = request.content
                rate = request.rate
                favorite = request.favorite
                reviewedAt = request.reviewedAt
            }
            true
        } else false
    }
        
    /** Deleta uma review */
    suspend fun delete(id: Int, userId: Int): Boolean = suspendTransaction {
        val reviewDAO = ReviewDAO.findById(id)
        if (reviewDAO != null && reviewDAO.userId.value == userId) {
            reviewDAO.delete()
            true
        } else false
    }
}