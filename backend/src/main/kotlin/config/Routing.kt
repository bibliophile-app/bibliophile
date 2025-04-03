package com.bibliophile.config

import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import com.bibliophile.routes.booklistRoutes
import com.bibliophile.routes.userRoutes

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Hello World!")
        }
        
        booklistRoutes()
        userRoutes()
    }
}