package com.bibliophile.config


import io.ktor.http.*
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database

fun Application.configureDatabases() {
    val url = System.getenv("DATABASE_URL")
    val user =  System.getenv("DATABASE_USER")
    val password = System.getenv("DATABASE_PASSWORD")

    Database.connect(
        url,
        user = user,
        password = password
    )
}
