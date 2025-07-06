package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.server.application.*

import com.bibliophile.models.UserSession
import com.bibliophile.models.QuoteRequest
import com.bibliophile.repositories.QuoteRepository

fun Route.quoteRoutes() {
    route("quotes") {
        get {
            val quotes = QuoteRepository.all()
            call.respond(HttpStatusCode.OK, quotes)
        }

        get("/{id}") {
            val id = call.getIntParam() ?: return@get
            val quote = QuoteRepository.findById(id)
            
            if (quote != null) {
                call.respond(HttpStatusCode.OK, quote)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "Quote not found"))
            }
        }

        get("/user/{identifier}") {
            val userId = call.resolveUserIdOrRespondNotFound() ?: return@get
            val quotes = QuoteRepository.findByUserId(userId)
            call.respond(HttpStatusCode.OK, quotes)
        }

        authenticate("auth-session") {
            post {
                val request = call.receive<QuoteRequest>()
                val session = call.sessions.get<UserSession>()

                val quote = QuoteRepository.add(session?.userId!!, request)
                call.respond(
                    HttpStatusCode.Created, 
                    mapOf("message" to "Quote created successfully", "id" to quote.id)
                )
            }

            put("/{id}") {
                val id = call.getIntParam() ?: return@put
                val request = call.receive<QuoteRequest>()
                val session = call.sessions.get<UserSession>()

                val success = QuoteRepository.update(id, session?.userId!!, request)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Quote updated successfully"))
                } else {
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this quote"))
                }
            }

            delete("/{id}") {
                val id = call.getIntParam() ?: return@delete
                val session = call.sessions.get<UserSession>()

                val success = QuoteRepository.delete(id, session?.userId!!)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Quote deleted successfully"))
                } else {
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this quote"))
                }
            }
        }
    }
}