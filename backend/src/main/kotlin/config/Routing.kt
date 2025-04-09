package com.bibliophile.config

import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import com.bibliophile.routes.quoteRoutes
import com.bibliophile.routes.reviewRoutes
import com.bibliophile.routes.booklistRoutes
import com.bibliophile.routes.authRoutes

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Hello World!")
        }
        
        booklistRoutes()
        authRoutes()
        quoteRoutes()
        reviewRoutes()
    }
}