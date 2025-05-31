package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.dao.id.EntityID

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Quote
import com.bibliophile.models.QuoteRequest
import com.bibliophile.db.entities.QuoteDAO
import com.bibliophile.db.tables.QuotesTable
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.suspendTransaction

object QuoteRepository {
    /** Retorna todas as quotes */
    suspend fun all(): List<Quote> = suspendTransaction {
        QuoteDAO.all().map(::daoToModel)
    }

    /** Busca uma quote pelo ID */
    suspend fun findById(id: Int): Quote? = suspendTransaction {
        QuoteDAO.findById(id)?.let(::daoToModel)
    }

    /** Busca quotes por usuário */
    suspend fun findByUserId(userId: Int): List<Quote> = suspendTransaction {
        QuoteDAO.find { QuotesTable.userId eq userId }
            .map(::daoToModel)
    }

    /** Adiciona uma nova quote */
    suspend fun add(userId: Int, request: QuoteRequest): Quote = suspendTransaction {
        QuoteDAO.new {
            this.userId = EntityID(userId, UsersTable)
            this.content = request.content
        }.let(::daoToModel)
    }

    /** Atualiza uma quote existente */
    suspend fun update(id: Int, userId: Int, request: QuoteRequest): Boolean = suspendTransaction {
        val quoteDAO = QuoteDAO.findById(id)
        if (quoteDAO != null && quoteDAO.userId.value == userId) {
            quoteDAO.apply {
                content = request.content
            }
            true
        } else false
    }

    /** Remove uma quote */
    suspend fun delete(id: Int, userId: Int): Boolean = suspendTransaction {
        val quoteDAO = QuoteDAO.findById(id)
        if (quoteDAO != null && quoteDAO.userId.value == userId) {
            quoteDAO.delete()
            true
        } else false
    }
}