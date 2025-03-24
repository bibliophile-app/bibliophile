package com.bibliophile.config

import io.ktor.http.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

import com.bibliophile.models.Booklist
import com.bibliophile.repositories.BooklistRepository

fun Application.configureSerialization(repository: BooklistRepository) {
    install(ContentNegotiation) {
        json()
    }
    routing {
        route("/api/booklists") {
            get {
                val booklists = repository.allBooklists()
                call.respond(booklists)
            }

            get("/byName/{booklistName}") {
                val name = call.parameters["booklistName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }
                val booklist = repository.booklistByName(name)
                if (booklist == null) {
                    call.respond(HttpStatusCode.NotFound)
                    return@get
                }
                call.respond(booklist)
            }

            post {
                try {
                    val booklist = call.receive<Booklist>()
                    repository.addBooklist(booklist)
                    call.respond(HttpStatusCode.NoContent)
                } catch (ex: IllegalStateException) {
                    call.respond(HttpStatusCode.NoContent)
                } catch (ex: JsonConvertException) {
                    call.respond(HttpStatusCode.NoContent)
                }
            }

            delete("/{booklistName}") {
                val name = call.parameters["booklistName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@delete
                }
                if (repository.removeBooklist(name)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}
