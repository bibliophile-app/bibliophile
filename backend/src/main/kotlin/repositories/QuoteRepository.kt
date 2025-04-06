package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Quote
import com.bibliophile.db.entities.QuoteDAO
import com.bibliophile.db.tables.QuotesTable
import com.bibliophile.db.suspendTransaction

class QuoteRepository {

    suspend fun allQuotes(): List<Quote> = suspendTransaction {
        QuoteDAO.all().map(::daoToModel)
    }

    suspend fun quote(quoteId: Int): Quote? = suspendTransaction {
        QuoteDAO.findById(quoteId)?.let(::daoToModel)
    }

    suspend fun addQuote(quote: Quote): Unit = suspendTransaction {
        QuoteDAO.new {
            userId = quote.userId
            content = quote.content
        }
    }

    suspend fun editQuote(quoteId: Int, quote: Quote): Boolean = suspendTransaction {
        val QuoteDAO = QuoteDAO.findById(quoteId) ?: return@suspendTransaction false
        QuoteDAO.apply {
            userId = editQuote.userId
            content = editQuote.content
        }
        true
    }

    suspend fun deleteQuote(quoteId: Int): Boolean = suspendTransaction {
        QuotesTable.deleteWhere { QuotesTable.quoteId eq quoteId }
        QuotesTable.deleteWhere { id eq quoteId } > 0
    }

}