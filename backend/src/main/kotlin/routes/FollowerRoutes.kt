package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.bibliophile.models.Follower
import com.bibliophile.services.FollowerService
import com.bibliophile.repositories.FollowerRepository

fun Route.followerRoutes() {

    val followerService = FollowerService(FollowerRepository())

    route("followers") {

        get {
            call.respond(HttpStatusCode.OK, followerService.getAllFollows())
        }

        get("/following/{userId}") {
            val userId = call.parameters["userId"]?.toIntOrNull()
            val (status, response) = followerService.getFollowingUsers(userId)
            call.respond(status, response)
        }

        get("/followers/{userId}") {
            val userId = call.parameters["userId"]?.toIntOrNull()
            val (status, response) = followerService.getFollowersOfUser(userId)
            call.respond(status, response)
        }

        get("/check") {
            val followingId = call.request.queryParameters["followingId"]?.toIntOrNull()
            val followedId = call.request.queryParameters["followedId"]?.toIntOrNull()
            val (status, response) = followerService.isFollowing(followingId, followedId)
            call.respond(status, response)
        }

        post {
            val follower = call.receive<Follower>()
            val (status, message) = followerService.addFollow(follower)
            call.respond(status, mapOf("message" to message))
        }

        delete {
            val followingId = call.request.queryParameters["followingId"]?.toIntOrNull()
            val followedId = call.request.queryParameters["followedId"]?.toIntOrNull()
            val (status, message) = followerService.deleteFollow(followingId, followedId)
            call.respond(status, mapOf("message" to message))
        }

        delete("/user/{userId}/following") {
            val userId = call.parameters["userId"]?.toIntOrNull()
            val (status, message) = followerService.deleteAllFollowsByUser(userId)
            call.respond(status, mapOf("message" to message))
        }

        delete("/user/{userId}/followers") {
            val userId = call.parameters["userId"]?.toIntOrNull()
            val (status, message) = followerService.deleteAllFollowersOfUser(userId)
            call.respond(status, mapOf("message" to message))
        }
    }
}
