package com.bibliophile.repositories

import java.time.LocalDate
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.greaterEq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

import com.bibliophile.models.Review
import com.bibliophile.models.ReviewRequest
import com.bibliophile.db.entities.ReviewDAO
import com.bibliophile.db.tables.ReviewsTable
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.tables.FollowersTable

object ReviewRepository {

    private suspend fun <T> suspendTransaction(block: suspend () -> T): T = newSuspendedTransaction { block() }

    /** Retorna todas as reviews com informações dos usuários */
    suspend fun all(): List<Review> = suspendTransaction {
        (ReviewsTable innerJoin UsersTable)
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

    /** Busca reviews por usuário */
    suspend fun findByUserId(userId: Int): List<Review> = suspendTransaction {
        (ReviewsTable innerJoin UsersTable)
            .select { ReviewsTable.userId eq userId }
            .orderBy(ReviewsTable.reviewedAt, SortOrder.DESC)
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

    /** Busca reviews por livro */
    suspend fun findByBookId(bookId: String): List<Review> = suspendTransaction {
        (ReviewsTable innerJoin UsersTable)
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

    /** Busca a review do usuário para um livro específico */
    suspend fun findMyReviewsForBook(userId: Int, bookId: String): List<Review> = suspendTransaction {
        (ReviewsTable innerJoin UsersTable)
            .select { (ReviewsTable.userId eq userId) and (ReviewsTable.bookId eq bookId) }
            .orderBy(ReviewsTable.reviewedAt, SortOrder.DESC)
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

    /** Busca as reviews dos amigos para um livro específico */
    suspend fun findFriendReviewsForBook(userId: Int, bookId: String, limit: Int = 10): List<Review> = suspendTransaction {
        val r = ReviewsTable.alias("r")
        val u = UsersTable.alias("u")
        val f = FollowersTable.alias("f")

        ((r.join(u, JoinType.INNER) { r[ReviewsTable.userId] eq u[UsersTable.id] })
            .join(f, JoinType.INNER) { r[ReviewsTable.userId] eq f[FollowersTable.followeeId] })
            .select {
                (r[ReviewsTable.bookId] eq bookId) and
                (f[FollowersTable.followerId] eq userId)
            }
            .orderBy(r[ReviewsTable.reviewedAt], SortOrder.DESC)
            .limit(limit)
            .map { row ->
                Review(
                    id = row[r[ReviewsTable.id]].value,
                    bookId = row[r[ReviewsTable.bookId]],
                    username = row[u[UsersTable.username]],
                    content = row[r[ReviewsTable.content]],
                    rate = row[r[ReviewsTable.rate]],
                    favorite = row[r[ReviewsTable.favorite]],
                    reviewedAt = row[r[ReviewsTable.reviewedAt]]
                )
            }
    }

    /** Busca as reviews mais populares dos amigos */
    suspend fun findRecentReviewsFromFriends(userId: Int, limit: Int = 10): List<Review> = suspendTransaction {
        val r = ReviewsTable.alias("r")
        val u = UsersTable.alias("u")
        val f = FollowersTable.alias("f")

        (r.join(u, JoinType.INNER) { r[ReviewsTable.userId] eq u[UsersTable.id] })
            .select {
                (r[ReviewsTable.userId] eq u[UsersTable.id]) and // Join condition
                exists(
                    f.select {
                        (f[FollowersTable.followerId] eq userId) and
                        (f[FollowersTable.followeeId] eq r[ReviewsTable.userId])
                    }
                )
            }
            .orderBy(r[ReviewsTable.reviewedAt], SortOrder.DESC)
            .limit(limit)
            .map { row ->
                Review(
                    id = row[r[ReviewsTable.id]].value,
                    bookId = row[r[ReviewsTable.bookId]],
                    username = row[u[UsersTable.username]],
                    content = row[r[ReviewsTable.content]],
                    rate = row[r[ReviewsTable.rate]],
                    favorite = row[r[ReviewsTable.favorite]],
                    reviewedAt = row[r[ReviewsTable.reviewedAt]]
                )
            }
    }

    /** Busca livros mais populares desta semana */
    suspend fun findPopularBooksThisWeek(limit: Int = 10): List<String> = suspendTransaction {
        ReviewsTable
            .slice(ReviewsTable.bookId, ReviewsTable.bookId.count())
            .select {
                ReviewsTable.reviewedAt.greaterEq(LocalDate.now().minusWeeks(1))
            }
            .groupBy(ReviewsTable.bookId)
            .orderBy(ReviewsTable.bookId.count(), SortOrder.DESC)
            .limit(limit)
            .map { row ->
                row[ReviewsTable.bookId]
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

        val username = UsersTable
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