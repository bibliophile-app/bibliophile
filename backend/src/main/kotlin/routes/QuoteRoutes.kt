package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.bibliophile.models.Quote
import com.bibliophile.repositories.QuoteRepository

fun Route.quoteRoutes() {
    val quoteRepository = QuoteRepository()

    route("quotes") {

        get {
            runCatching {
                quoteRepository.allQuotes()
            }.onSuccess {
                call.respond(HttpStatusCode.OK, it)
            }.onFailure {
                call.respondServerError("Failed to retrieve quotes")
            }
        }

        get("/{id}") {
            val id = call.getIntParam() ?: return@get

            runCatching {
                quoteRepository.quote(id)
            }.onSuccess { quote ->
                if (quote != null) {
                    call.respond(HttpStatusCode.OK, quote)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Quote not found"))
                }
            }.onFailure {
                call.respondServerError("Error retrieving quote")
            }
        }

        post {
            val quote = call.receive<Quote>()
            runCatching {
                quoteRepository.addQuote(quote)
            }.onSuccess {
                call.respond(HttpStatusCode.Created, mapOf("message" to "Quote created successfully"))
            }.onFailure {
                call.respondServerError("Failed to create quote")
            }
        }

        put("/{id}") {
            val id = call.getIntParam() ?: return@put
            val updatedQuote = call.receive<Quote>()

            runCatching {
                quoteRepository.editQuote(id, updatedQuote)
            }.onSuccess { updated ->
                if (updated) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Quote updated successfully"))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Quote not found"))
                }
            }.onFailure {
                call.respondServerError("Failed to update quote")
            }
        }

        delete("/{id}") {
            val id = call.getIntParam() ?: return@delete

            runCatching {
                quoteRepository.deleteQuote(id)
            }.onSuccess { deleted ->
                if (deleted) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Quote deleted successfully"))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Quote not found"))
                }
            }.onFailure {
                call.respondServerError("Failed to delete quote")
            }
        }
    }
}