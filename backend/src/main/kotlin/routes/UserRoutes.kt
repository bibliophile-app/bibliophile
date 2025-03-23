package routes

import dao.UserDAO
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import models.User

fun Route.userRoutes() {
    route("/users") {

        get {
            call.respond(UserDAO.getAllUsers())
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, "ID inválido")
                return@get
            }

            val user = UserDAO.getUserById(id)
            if (user == null) {
                call.respond(HttpStatusCode.NotFound, "Usuário não encontrado")
            } else {
                call.respond(user)
            }
        }

        post {
            val user = call.receive<User>()
            val newUser = UserDAO.addUser(user.username, user.name, user.passwordHash)
            call.respond(HttpStatusCode.Created, newUser)
        }

        delete("/{username}") {
            val username = call.parameters["username"]
            if (username.isNullOrEmpty()) {
                call.respond(HttpStatusCode.BadRequest, "Username inválido")
                return@delete
            }

            val deleted = UserDAO.deleteUser(username)
            if (deleted) {
                call.respond(HttpStatusCode.OK, "Usuário deletado")
            } else {
                call.respond(HttpStatusCode.NotFound, "Usuário não encontrado")
            }
        }
    }
}