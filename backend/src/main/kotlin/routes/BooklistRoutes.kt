package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.server.application.*

import com.bibliophile.models.UserSession
import com.bibliophile.models.BookRequest
import com.bibliophile.models.BooklistRequest
import com.bibliophile.repositories.BooklistRepository

fun Route.booklistRoutes() {
    route("booklists") {
        get {
            val booklists = BooklistRepository.all()
            call.respond(HttpStatusCode.OK, booklists)
        }

        get("/{id}") {
            val id = call.getIntParam() ?: return@get
            val booklist = BooklistRepository.findById(id)

            if (booklist != null) {
                call.respond(HttpStatusCode.OK, booklist)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "Booklist not found"))
            }
        }

        get("/{id}/books") {            
            val id = call.getIntParam() ?: return@get
            val booklist = BooklistRepository.findWithBooks(id)

            if (booklist != null) {
                call.respond(HttpStatusCode.OK, booklist)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "Booklist not found"))
            }
        }

        get("/user/{identifier}") {
            val userId = call.resolveUserIdOrRespondNotFound() ?: return@get
            val booklists = BooklistRepository.findByUserId(userId)
            call.respond(HttpStatusCode.OK, booklists)
        }

        get("/user/{identifier}/default") {
            val userId = call.resolveUserIdOrRespondNotFound() ?: return@get
            val default = BooklistRepository.findDefault(userId)

            if (default != null) {
                call.respond(HttpStatusCode.OK, default)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "User's default list not found"))
            }
        }

        authenticate("auth-session") { 
            post {
                val request = call.receive<BooklistRequest>()
                val session = call.sessions.get<UserSession>()

                runCatching {
                    BooklistRepository.add(session?.userId!!, request)
                }.onSuccess {
                    call.respond(HttpStatusCode.Created, mapOf("message" to "Booklist created successfully - Booklist ID: ${it.id}"))
                }.onFailure {
                    call.respondSqlException(it) { sql ->
                        sql.message?.contains("unique constraint", ignoreCase = true) == true
                    }
                }
            }

            post("/{id}/books") {
                val id = call.getIntParam() ?: return@post
                val request = call.receive<BookRequest>()
                val session = call.sessions.get<UserSession>()
                
                runCatching {
                    BooklistRepository.addBookToList(id, session?.userId!!, request.bookId)
                }.onSuccess {
                    if (it)
                        call.respond(HttpStatusCode.Created, mapOf("message" to "Book added to booklist successfully"))
                    else
                        call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this booklist"))
                }.onFailure {
                    call.respondSqlException(it)
                }
            }

            put("/{id}") {
                val id = call.getIntParam() ?: return@put
                val request = call.receive<BooklistRequest>()
                val session = call.sessions.get<UserSession>()

                runCatching {
                    BooklistRepository.update(id, session?.userId!!, request)
                }.onSuccess {
                    if (it)
                        call.respond(HttpStatusCode.OK, mapOf("message" to "Booklist updated successfully"))
                    else
                        call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this booklist"))
                }.onFailure {
                    call.respondSqlException(it)
                }
            }

            delete("/{id}") {
                val id = call.getIntParam() ?: return@delete
                val session = call.sessions.get<UserSession>()
                
                val success = BooklistRepository.delete(id, session?.userId!!)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Booklist deleted successfully"))
                } else {
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this booklist"))
                }
            }

            delete("/{id}/books/{bookId}") {
                val id = call.getIntParam() ?: return@delete
                val bookId = call.getParam("bookId") ?: return@delete
                val session = call.sessions.get<UserSession>()

                val success = BooklistRepository.removeBookFromList(id, session?.userId!!, bookId)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Book deleted from booklist successfully"))
                } else {
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this booklist"))
                }
            }
        }
    }
}