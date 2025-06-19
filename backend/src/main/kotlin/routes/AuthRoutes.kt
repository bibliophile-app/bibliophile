package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.util.date.GMTDate
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*

import com.bibliophile.models.UserSession
import com.bibliophile.models.UserRequest
import com.bibliophile.models.LoginRequest
import com.bibliophile.repositories.UserRepository
import com.bibliophile.repositories.BooklistRepository

fun Route.authRoutes() {
    post("/register") {
        val request = call.receive<UserRequest>()
        
        if (UserRepository.findByUsername(request.username) != null) {
            call.respond(HttpStatusCode.Conflict, mapOf(
                "message" to "Username already exists"
            ))
            return@post
        }

        val user = UserRepository.add(request)
        BooklistRepository.addDefault(user.id)

        call.sessions.set(UserSession(user.id))
        call.respond(HttpStatusCode.Created, mapOf(
            "message" to "User registered successfully - User ID: ${user.id}"
        ))
    }

    post("/login") {
        val request = call.receive<LoginRequest>()
        
        val user = UserRepository.authenticate(
            request.username,
            request.password
        )

        if (user == null) {
            call.respond(HttpStatusCode.Unauthorized, mapOf(
                "message" to "Invalid credentials"
            ))
            return@post
        }

        call.sessions.set(UserSession(user.id))
        call.respond(HttpStatusCode.OK, mapOf(
            "message" to "Login successful"
        ))
    }


    get("/logout") {
        call.sessions.clear<UserSession>()
        call.response.cookies.append(createExpiredSessionCookie())
        call.respond(HttpStatusCode.OK, mapOf(
            "message" to "Logged out successfully"
        ))
    }

    get("/me") {
        val session = call.sessions.get<UserSession>()
        val userId = session?.userId

        if (userId == null) {
            call.respond(HttpStatusCode.Unauthorized, mapOf(
                "message" to "Not authenticated"
            ))
            return@get
        }

        val profile = UserRepository.findProfileById(userId)
        if (profile != null) {
            call.respond(HttpStatusCode.OK, profile)
        } else {
            call.respond(HttpStatusCode.NotFound, mapOf(
                "message" to "Profile not found"
            ))
        }
    }
}

private fun createExpiredSessionCookie() = Cookie(
    name = "USER_SESSION",
    value = "",
    path = "/",                
    secure = true,
    httpOnly = true,
    extensions = mapOf("SameSite" to "None"),
    expires = GMTDate.START       
)