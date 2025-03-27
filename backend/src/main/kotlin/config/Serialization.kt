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

            put("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, "Invalid user ID")
                    return@put
                }
                
                try {
                    val updatedUser = call.receive<User>().copy(id = id)
                    val result = userRepository.updateUsername(updatedUser)
                    call.respond(HttpStatusCode.OK, result)
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, "Error updating user")
                }
            }         

            delete("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, "Invalid user ID")
                    return@delete
                }
                if (userRepository.deleteUserById(id)) {  
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Invalid user ID")
                }
            }
        }
    }
}
