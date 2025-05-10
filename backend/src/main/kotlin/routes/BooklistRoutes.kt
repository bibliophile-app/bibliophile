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

        authenticate("auth-session") { 
            post {
                val booklist = call.receive<BooklistRequest>()
                val session = call.sessions.get<UserSession>()
               
                runCatching {
                    booklistRepository.addBooklist(session?.userId!!, booklist)
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
                val book = call.receive<BookRequest>()
                val session = call.sessions.get<UserSession>()
                
                runCatching {
                    booklistRepository.addBookToBooklist(id, session?.userId!!, book.bookId)
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
                val booklist = call.receive<BooklistRequest>()
                val session = call.sessions.get<UserSession>()

                runCatching {
                    booklistRepository.updateBooklist(id, session?.userId!!, booklist)
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
                
                runCatching {
                    booklistRepository.removeBooklist(id, session?.userId!!)
                }.onSuccess {
                    if (it)
                        call.respond(HttpStatusCode.OK, mapOf("message" to "Booklist deleted successfully"))
                    else
                        call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this booklist"))
                }.onFailure {
                    call.respondServerError("Failed to delete booklist")
                }
            }

            delete("/{id}/books/{bookId}") {
                val id = call.getIntParam() ?: return@delete
                val bookId = call.getParam("bookId") ?: return@delete
                val session = call.sessions.get<UserSession>()

                runCatching {
                    booklistRepository.removeBookFromBooklist(id, session?.userId!!, bookId)
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
}