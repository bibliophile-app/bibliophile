package com.bibliophile.routes

import io.ktor.http.*
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
    val booklistRepository= BooklistRepository()

    route("booklists") {

        get {
            runCatching {
                booklistRepository.allBooklists()
            }.onSuccess {
                call.respond(HttpStatusCode.OK, it)
            }.onFailure {
                call.respondServerError("Failed to retrieve booklists")
            }
        }

        get("/{id}") {
            val id = call.getIntParam() ?: return@get

            runCatching {
                booklistRepository.booklist(id)
            }.onSuccess {
                if (it == null)
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Booklist not found"))
                else
                    call.respond(HttpStatusCode.OK, it)
            }.onFailure {
                call.respondSqlException(it)
            }
        }

        get("/{id}/books") {            
            val id = call.getIntParam() ?: return@get

            runCatching {
                booklistRepository.booklistWithBooks(id)
            }.onSuccess {
                if (it == null)
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Booklist not found"))
                else
                    call.respond(HttpStatusCode.OK, it)
            }.onFailure {
                call.respondSqlException(it)
            }
        }

        post {
            val booklist = call.receive<BooklistRequest>()
            val session = call.sessions.get<UserSession>()
            val userId = session?.userId
            if (userId == null) {
                call.respond(HttpStatusCode.Unauthorized)
                return@post
            }

            runCatching {
                booklistRepository.addBooklist(session.userId, booklist)
            }.onSuccess {
                call.respond(HttpStatusCode.Created, mapOf("message" to "Booklist created successfully"))
            }.onFailure {
                call.respondSqlException(it) { sql ->
                    sql.message?.contains("unique constraint", ignoreCase = true) == true
                }
            }
        }

        post("/{id}/books") {
            val id = call.getIntParam() ?: return@post
            val session = call.sessions.get<UserSession>()
            val userId = session?.userId
            
            if (userId == null) {
                call.respond(HttpStatusCode.Unauthorized)
                return@post
            }
            val book = call.receive<BookRequest>()
            
            runCatching {
                booklistRepository.addBookToBooklist(id, userId, book.isbn)
            }.onSuccess {
                call.respond(HttpStatusCode.Created, mapOf("message" to "Book added to booklist successfully"))
            }.onFailure {
                call.respondSqlException(it) { sql ->
                    sql.message?.contains("unique constraint", ignoreCase = true) == true
                }
            }
        }

        put("/{id}") {
            val id = call.getIntParam() ?: return@put
            val session = call.sessions.get<UserSession>()
            val userId = session?.userId
            if (userId == null) {
                call.respond(HttpStatusCode.Unauthorized)
                return@put
            }
            
            val booklist = call.receive<BooklistRequest>()

            runCatching {
                booklistRepository.updateBooklist(id, userId, booklist)
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
            val userId = session?.userId
            if (userId == null) {
                call.respond(HttpStatusCode.Unauthorized)
                return@delete
            }
            
            runCatching {
                booklistRepository.removeBooklist(id, userId)
            }.onSuccess {
                if (it)
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Booklist deleted successfully"))
                else
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this booklist"))
            }.onFailure {
                call.respondServerError("Failed to delete booklist")
            }
        }

        delete("/{id}/books/{isbn}") {
            val id = call.getIntParam() ?: return@delete
            val isbn = call.getParam("isbn") ?: return@delete
            val session = call.sessions.get<UserSession>()
            val userId = session?.userId
            if (userId == null) {
                call.respond(HttpStatusCode.Unauthorized)
                return@delete
            }

            runCatching {
                booklistRepository.removeBookFromBooklist(id, userId, isbn)
            }.onSuccess {
                if (it)
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Book deleted from booklist successfully"))
                else
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this booklist"))
            }.onFailure {
                call.respondServerError("Failed to delete book from booklist")
            }
        }
    }
}