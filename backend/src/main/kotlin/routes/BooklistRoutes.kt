package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.application.*
import com.bibliophile.models.Booklist
import com.bibliophile.models.BooklistBook
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
            val booklist = call.receive<Booklist>()

            runCatching {
                booklistRepository.addBooklist(booklist)
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
            val booklistBook = call.receive<BooklistBook>()
            
            runCatching {
                booklistRepository.addBookToBooklist(id, booklistBook.isbn)
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
            val updated = call.receive<Booklist>()

            runCatching {
                booklistRepository.updateBooklist(id, updated)
            }.onSuccess {
                if (it)
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Booklist updated successfully"))
                else
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Booklist not found"))
            }.onFailure {
                call.respondSqlException(it)
            }
        }

        delete("/{id}") {
            val id = call.getIntParam() ?: return@delete
            
            runCatching {
                booklistRepository.removeBooklist(id)
            }.onSuccess {
                if (it)
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Booklist deleted successfully"))
                else
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Booklist not found"))
            }.onFailure {
                call.respondServerError("Failed to delete booklist")
            }
        }

        delete("/{id}/books/{isbn}") {
            val id = call.getIntParam() ?: return@delete
            val isbn = call.getParam("isbn") ?: return@delete
            
            runCatching {
                booklistRepository.removeBookFromBooklist(id, isbn)
            }.onSuccess {
                if (it)
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Book deleted from booklist successfully"))
                else
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Book not found in this booklist"))
            }.onFailure {
                call.respondServerError("Failed to delete book from booklist")
            }
        }
    }
}