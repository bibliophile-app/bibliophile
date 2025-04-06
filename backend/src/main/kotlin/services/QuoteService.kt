package com.bibliophile.services

import io.ktor.http.*
import java.sql.SQLException
import com.bibliophile.models.Quote
import com.bibliophile.repositories.QuoteRepository

class QuoteService(private val quoteRepository: QuoteRepository) {

    suspend fun getAllQuotes(): Pair<HttpStatusCode, Any> {
        return try {
            val quotes = quoteRepository.allQuotes()
            HttpStatusCode.OK to quotes
        } catch (e: Exception) {
            HttpStatusCode.InternalServerError to mapOf("message" to "Failed to retrieve quotes")
        }
    }

    suspend fun getQuote(id: Int?): Pair<HttpStatusCode, Any> {
        if (id == null) {
            return HttpStatusCode.BadRequest to mapOf("message" to "Invalid ID")
        }
        
        return try {
            quoteRepository.quote(id)?.let { quote ->
                HttpStatusCode.OK to quote
            } ?: HttpStatusCode.NotFound to mapOf("message" to "Quote not found")
        } catch (e: Exception) {
            HttpStatusCode.InternalServerError to mapOf("message" to "Error retrieving quote")
        }
    }

    suspend fun addQuote(quote: Quote): Pair<HttpStatusCode, Any> {
        return try {
            quoteRepository.addQuote(quote)
            HttpStatusCode.Created to mapOf("message" to "Quote created successfully")
        } catch (e: Exception) {
            HttpStatusCode.InternalServerError to mapOf("message" to "Failed to create quote")
        }
    }

    suspend fun editQuote(id: Int?, quote: Quote): Pair<HttpStatusCode, Any> {
        if (id == null) {
            return HttpStatusCode.BadRequest to mapOf("message" to "Invalid ID")
        }

        return try {
            val success = quoteRepository.editQuote(id, quote)
            if (success) {
                HttpStatusCode.OK to mapOf("message" to "Quote updated successfully")
            } else {
                HttpStatusCode.NotFound to mapOf("message" to "Quote not found")
            }
        } catch (e: Exception) {
            HttpStatusCode.InternalServerError to mapOf("message" to "Failed to update quote")
        }
    }

    suspend fun deleteQuote(id: Int?): Pair<HttpStatusCode, Any> {
        if (id == null) {
            return HttpStatusCode.BadRequest to mapOf("message" to "Invalid ID")
        }

        return try {
            val success = quoteRepository.deleteQuote(id)
            if (success) {
                HttpStatusCode.OK to mapOf("message" to "Quote deleted successfully")
            } else {
                HttpStatusCode.NotFound to mapOf("message" to "Quote not found")
            }
        } catch (e: Exception) {
            HttpStatusCode.InternalServerError to mapOf("message" to "Failed to delete quote")
        }
    }
}