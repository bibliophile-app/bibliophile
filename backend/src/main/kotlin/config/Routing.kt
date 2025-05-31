package com.bibliophile.config

import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import com.bibliophile.routes.*

fun Application.configureRouting() {
    routing {
        booklistRoutes()
        authRoutes()
        userRoutes()
        quoteRoutes()
        reviewRoutes()
        followerRoutes()
    }
}