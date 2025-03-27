package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.bibliophile.models.Booklist
import com.bibliophile.services.BooklistService

fun Route.booklistRoutes() {

    val booklistService = BooklistService()

    route("/api/booklists") {
        
        get {
            call.respond(HttpStatusCode.OK, booklistService.getAllBooklists())
        }

        get("/{booklistName}") {
            val name = call.parameters["booklistName"]
            val (status, response) = booklistService.getBooklistByName(name)
            call.respond(status, response)
        }

        get("/{booklistName}/books") {
            val name = call.parameters["booklistName"]
            val (status, response) = booklistService.getBooklistWithBooks(name)
            call.respond(status, response)
        }

        post {
            val booklist = call.receive<Booklist>()
            val status = booklistService.addBooklist(booklist)
            call.respond(status)
        }

        delete("/{booklistName}") {
            val name = call.parameters["booklistName"]
            val status = booklistService.removeBooklist(name)
            call.respond(status)
        }
    }
}
