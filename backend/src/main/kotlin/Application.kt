package com.bibliophile

import com.bibliophile.config.*
import io.ktor.server.application.*
import com.bibliophile.repositories.BooklistRepository

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    val repository = BooklistRepository()

    configureSerialization(repository)

    configureMonitoring()
    configureDatabases()
    configureRouting()
    configureHTTP()
}
