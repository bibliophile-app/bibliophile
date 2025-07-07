package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.server.application.*

import com.bibliophile.models.UserSession
import com.bibliophile.models.FollowRequest
import com.bibliophile.repositories.FollowerRepository

fun Route.followerRoutes() {
    route("followers") {
        get {
            val follows = FollowerRepository.all()
            call.respond(HttpStatusCode.OK, follows)
        }

        get("/{identifier}/following") {
            val userId = call.resolveUserIdOrRespondNotFound() ?: return@get
            val following = FollowerRepository.findByFollowerId(userId)
            call.respond(HttpStatusCode.OK, following)
        }

        get("/{identifier}/followers") {
            val userId = call.resolveUserIdOrRespondNotFound() ?: return@get
            val followers = FollowerRepository.findByFolloweeId(userId)
            call.respond(HttpStatusCode.OK, followers)
        }

        get("/check") {
            val followerId = call.request.queryParameters["followerId"]?.toIntOrNull()
            val followeeId = call.request.queryParameters["followeeId"]?.toIntOrNull()
        
            if (followerId == null || followeeId == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Both user IDs are required"))
                return@get
            }
        
            val isFollowing = FollowerRepository.exists(followerId, followeeId)
            call.respond(HttpStatusCode.OK, mapOf("isFollowing" to isFollowing))
        }

        authenticate("auth-session") {
            post {
                val request = call.receive<FollowRequest>()
                val session = call.sessions.get<UserSession>()

                if (session?.userId == request.followeeId) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("message" to "User cannot follow themselves"))
                    return@post
                }

                if (FollowerRepository.exists(session?.userId!!, request.followeeId)) {
                    call.respond(HttpStatusCode.Conflict, mapOf("message" to "Already following this user"))
                    return@post
                }

                val follow = FollowerRepository.add(session.userId, request)
                call.respond(
                    HttpStatusCode.Created, 
                    mapOf("message" to "Follow created successfully - Follow ID: ${follow.id}")
                )
            }

            delete {
                val request = call.receive<FollowRequest>()
                val session = call.sessions.get<UserSession>()

                val success = FollowerRepository.delete(session?.userId!!, request)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Unfollowed successfully"))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Follow not found"))
                }
            }
        }
    }
}