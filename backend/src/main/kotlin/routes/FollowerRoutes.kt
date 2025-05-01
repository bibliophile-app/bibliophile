package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.server.application.*
import com.bibliophile.models.UserSession
import com.bibliophile.models.FollowerRequest
import com.bibliophile.repositories.FollowerRepository


fun Route.followerRoutes() {
    val followerRepository = FollowerRepository()

    route("followers") {
        // retorna todos os follows
        get {
            runCatching {
                followerRepository.getAllFollows()
            }.onSuccess { list ->
                call.respond(HttpStatusCode.OK, list)
            }.onFailure {
                call.respondServerError("Failed to retrieve follows")
            }
        }

        // retorna quem o usuário segue
        get("/{userId}/following") {
            val userId = call.getIntParam() ?: return@get
            runCatching {
                if (userId < 0) throw IllegalArgumentException("User ID inválido")
                followerRepository.getFollowingUsers(userId)
            }.onSuccess { follows ->
                call.respond(HttpStatusCode.OK, follows)
            }.onFailure {
                call.respondServerError("Error retrieving following users")
            }
        }

        // retorna seguidores de um usuário
        get("/{userId}/followers") {
            val userId = call.getIntParam() ?: return@get
            runCatching {
                if (userId < 0) throw IllegalArgumentException("User ID inválido")
                followerRepository.getFollowersOfUser(userId)
            }.onSuccess { followers ->
                call.respond(HttpStatusCode.OK, followers)
            }.onFailure {
                call.respondServerError("Error retrieving followers of user")
            }
        }

        // verificar se um usuário está seguindo outro
        get("/check") {
            val followerId = call.request.queryParameters["followerId"]?.toIntOrNull()
            val followeeId = call.request.queryParameters["followeeId"]?.toIntOrNull()
            
            runCatching {
                if (followerId == null || followeeId == null) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Both user IDs are required"))
                    return@get
                }
                followerRepository.isFollowing(followerId, followeeId)
                //call.respond(HttpStatusCode.OK, mapOf("isFollowing" to isFollowing))
            }.onSuccess {
                call.respond(HttpStatusCode.Created, mapOf("message" to "Follow verification successful"))
            }.onFailure {
                call.respondServerError("Error checking follow status")
            }
        }

        authenticate("auth-session") {
            // cria um follow
            post {
                runCatching {
                    val follower = call.receive<FollowerRequest>()
                    // valida campos
                    if (follower.followerId == follower.followeeId) {
                        call.respond(HttpStatusCode.BadRequest, mapOf("message" to "User cannot follow themselves"))
                        return@runCatching
                    }
                    // verifica existência
                    if (followerRepository.isFollowing(follower.followerId, follower.followeeId)) {
                        call.respond(HttpStatusCode.Conflict, mapOf("message" to "User is already following this person"))
                        return@runCatching
                    }
                    followerRepository.addFollow(follower)
                }.onSuccess{
                    call.respond(HttpStatusCode.Created, mapOf("message" to "Follow created successfully"))
                }.onFailure {
                    call.respondServerError("Failed to create follow")
                }
            }

            // deleta um follow específico
            delete {
                runCatching {
                    val followerId = call.request.queryParameters["followerId"]?.toIntOrNull()
                    val followeeId = call.request.queryParameters["followeeId"]?.toIntOrNull()
                    if (followerId == null || followeeId == null) {
                        call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Both user IDs are required"))
                        return@runCatching
                    }
                    followerRepository.deleteFollow(followerId, followeeId)
                }.onSuccess {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Follow deleted successfully"))
                }.onFailure {
                    call.respondServerError("Failed to delete follow")
                }
            }

            // deleta todos que o usuário segue
            delete("/user/{userId}/following") {
                runCatching {
                    val userId = call.getIntParam() ?: return@runCatching
                    followerRepository.deleteAllFollowsByUser(userId)
                }.onSuccess {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "All follows deleted for user"))
                }.onFailure {
                    call.respondServerError("Failed to delete all follows by user")
                }
            }

            // deleta todos os seguidores de um usuário
            delete("/user/{userId}/followers") {
                runCatching {
                    val userId = call.getIntParam() ?: return@runCatching
                    followerRepository.deleteAllFollowersOfUser(userId)
                }.onSuccess {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "All followers deleted for user"))
                }.onFailure {
                    call.respondServerError("Failed to delete all followers of user")
                }
            }
        }
    }
}
