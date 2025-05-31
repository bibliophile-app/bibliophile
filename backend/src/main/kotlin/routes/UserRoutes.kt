package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*

import com.bibliophile.models.User
import com.bibliophile.models.UserRequest
import com.bibliophile.models.UserSession
import com.bibliophile.repositories.UserRepository

fun Route.userRoutes() {
    route("users") {
        get {
            val users = UserRepository.all()
            call.respond(HttpStatusCode.OK, users)
        }

        get("/{identifier}") {
            val userId = call.resolveUserIdOrRespondNotFound() ?: return@get
            val profile = UserRepository.findProfileById(userId)
            
            if (profile != null) {
                call.respond(HttpStatusCode.OK, profile)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "User not found"))
            }
        }

        authenticate("auth-session") {
            put("/{id}") {
                val id = call.getIntParam() ?: return@put
                val session = call.sessions.get<UserSession>()
                
                if (session?.userId != id) {
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "Can only update own profile"))
                    return@put
                }

                val request = call.receive<UserRequest>()
                val success = UserRepository.update(id, request)
                
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "User updated successfully"))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "User not found"))
                }
            }

            delete("/{id}") {
                val id = call.getIntParam() ?: return@delete
                val session = call.sessions.get<UserSession>()
                
                if (session?.userId != id) {
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "Can only delete own account"))
                    return@delete
                }

                val success = UserRepository.delete(id)
                if (success) {
                    call.sessions.clear<UserSession>()
                    call.respond(HttpStatusCode.OK, mapOf("message" to "User deleted successfully"))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "User not found"))
                }
            }
        }
    }
}