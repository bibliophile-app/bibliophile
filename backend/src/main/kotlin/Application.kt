package com.bibliophile

import com.bibliophile.config.*
import io.ktor.server.application.*
import io.ktor.server.sessions.*

import com.bibliophile.models.UserSession
import com.bibliophile.db.DatabaseFactory


fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    install(Sessions) {
        cookie<UserSession>("USER_SESSION") {
            cookie.httpOnly = true 
            cookie.secure = true // `false` only if running locally (not HTTPS)
            cookie.extensions["SameSite"] = "None"
            cookie.maxAgeInSeconds = 60 * 60 * 24
        }
    }

    configureSerialization()
    configureMonitoring()
    configureRouting()
    configureHTTP()

    DatabaseFactory.init()
}
