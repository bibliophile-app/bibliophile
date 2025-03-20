package com.bibliophile

import com.bibliophile.config.*
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    DatabaseFactory.init()
    configureMonitoring()
    configureHTTP()
    configureSerialization()
    configureRouting()
}
