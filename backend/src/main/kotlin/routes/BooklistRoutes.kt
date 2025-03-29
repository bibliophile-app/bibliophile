package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.bibliophile.models.Booklist
import com.bibliophile.models.BooklistBook
import com.bibliophile.services.BooklistService

fun Route.booklistRoutes() {

    val booklistService = BooklistService()

    route("booklists") {

        get {
            call.respond(HttpStatusCode.OK, booklistService.getAllBooklists())
        }

        get("/{booklistId}") {
            val booklistId = call.parameters["booklistId"]
            val (status, response) = booklistService.getBooklistById(booklistId)
            call.respond(status, response)
        }

        get("/{booklistId}/books") {
            val booklistId = call.parameters["booklistId"]
            val (status, response) = booklistService.getBooklistWithBooks(booklistId)
            call.respond(status, response)
        }

        post {
            val booklist = call.receive<Booklist>()
            val (status, message) = booklistService.addBooklist(booklist)
            call.respond(status, mapOf("message" to message))
        }

        post("/{booklistId}/books") {
            val booklistBook = call.receive<BooklistBook>()
            val (status, message) = booklistService.addBookToBooklist(booklistBook)
            call.respond(status, mapOf("message" to message))
        }

        put("/{booklistId}") {
            val booklistId = call.parameters["booklistId"]?.toIntOrNull()
            val updatedBooklist = call.receive<Booklist>()
            val (status, message) = booklistService.updateBooklist(booklistId, updatedBooklist)
            call.respond(status, mapOf("message" to message))
        }

        delete("/{booklistId}") {
            val booklistId = call.parameters["booklistId"]
            val (status, message) = booklistService.removeBooklist(booklistId)
            call.respond(status, mapOf("message" to message))
        }

        delete("/{booklistId}/books/{isbn}") {
            val booklistId = call.parameters["booklistId"]
            val isbn = call.parameters["isbn"]
            
            val (status, message) = booklistService.removeBookFromBooklist(isbn, booklistId)
            call.respond(status, mapOf("message" to message))
        }
    }
}
