package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.bibliophile.models.Quote
import com.bibliophile.services.QuoteService
import com.bibliophile.repositories.QuoteRepository

fun Route.quoteRoutes() {
    val quoteService = QuoteService(QuoteRepository())

    route("quotes") {
        get {
            val (status, response) = quoteService.getAllQuotes()
            call.respond(status, response)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val (status, response) = quoteService.getQuote(id)
            call.respond(status, response)
        }

        post {
            val quote = call.receive<Quote>()
            val (status, message) = quoteService.addQuote(quote)
            call.respond(status, message)
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val updatedQuote = call.receive<Quote>()
            val (status, message) = quoteService.updateQuote(id, updatedQuote)
            call.respond(status, message)
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val (status, message) = quoteService.deleteQuote(id)
            call.respond(status, message)
        }
    }
}