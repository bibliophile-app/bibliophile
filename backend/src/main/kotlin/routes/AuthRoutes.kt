package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import kotlinx.serialization.Serializable
import com.bibliophile.auth.*
import com.bibliophile.models.UserSession
import com.bibliophile.repositories.UserRepository

// DTOS
@Serializable
data class RegisterRequest(val username: String, val password: String)

@Serializable
data class LoginRequest(val username: String, val password: String)


fun Route.authRoutes() {

    val UserRepository = UserRepository()

    post("/register") {
        val data = call.receive<RegisterRequest>()
        if (UserRepository.findByUsername(data.username) != null) {
            call.respond(HttpStatusCode.Conflict, "Username already exists")
            return@post
        }
        val user = UserRepository.create(data.username, hashPassword(data.password))
        call.sessions.set(UserSession(user.id))
        call.respond(HttpStatusCode.OK, mapOf("message" to "Registered"))
    }
    
    post("/login") {
        val data = call.receive<LoginRequest>()
        val user = UserRepository.findByUsername(data.username)
        if (user == null || !verifyPassword(data.password, user.passwordHash)) {
            call.respond(HttpStatusCode.Unauthorized, "Invalid credentials")
            return@post
        }
        call.sessions.set(UserSession(user.id))
        call.respond(HttpStatusCode.OK, mapOf("message" to "Logged in"))
    }
    
    get("/logout") {
        call.sessions.clear<UserSession>()
        call.respond(HttpStatusCode.OK, mapOf("message" to "Logged out"))
    }

    get("/me") {
        val session = call.sessions.get<UserSession>()
        val user = session?.let { id -> UserRepository.findById(id.userId!!) }
        if (user == null) {
            call.respond(HttpStatusCode.Unauthorized)
        } else {
            call.respond(user)
        }
    }

    get("/users/{username}") {
        val username = call.parameters["username"] ?: return@get call.respond(HttpStatusCode.BadRequest)
        val user = UserRepository.findByUsername(username)
        if (user == null) {
            call.respond(HttpStatusCode.NotFound)
        } else {
            call.respond(mapOf("username" to user.username))
        }
    }
}