package com.bibliophile.config

import io.ktor.serialization.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

import com.bibliophile.models.User
import com.bibliophile.repositories.UserRepository

fun Application.configureSerialization(userRepository: UserRepository) {
    install(ContentNegotiation) {
        json()
    }
    routing {
        route("/api/users") {

            get {
                val users = userRepository.getAllUsers()  
                call.respond(users)
            }

            get("/{username}") {
                val username = call.parameters["username"]
                if (username == null) {
                    call.respond(HttpStatusCode.BadRequest, "Username is required")
                    return@get
                }
                val user = userRepository.getUserByUsername(username) 
                if (user == null) {
                    call.respond(HttpStatusCode.NotFound, "User not found")
                    return@get
                }
                call.respond(user)
            }

            post {
                try {
                    val user = call.receive<User>()
                    userRepository.addUser(user) 
                    call.respond(HttpStatusCode.Created)
                } catch (ex: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest, "Invalid request")
                }
            }

            delete("/{username}") {
                val username = call.parameters["username"]
                if (username == null) {
                    call.respond(HttpStatusCode.BadRequest, "Username is required")
                    return@delete
                }
                if (userRepository.deleteUserByUsername(username)) {  
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound, "User not found")
                }
            }
        }
    }
}
