package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.bibliophile.models.User
import com.bibliophile.services.UserService
import com.bibliophile.repositories.UserRepository

fun Route.userRoutes() {

    val userService = UserService(UserRepository())

    route("users") {

        get {
            call.respond(HttpStatusCode.OK, userService.getAllUsers())
        }

        get("/{username}") {
            val username = call.parameters["username"]
            val (status, response) = userService.getUserByUsername(username)
            call.respond(status, response)
        }

        post {
            val user = call.receive<User>()
            val (status, message) = userService.addUser(user)
            call.respond(status, mapOf("message" to message))
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val updatedUser = call.receive<User>()
            val (status, message) = userService.updateUsername(id, updatedUser)
            call.respond(status, mapOf("message" to message))
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val (status, message) = userService.deleteUserById(id)
            call.respond(status, mapOf("message" to message))
        }
    }
}
