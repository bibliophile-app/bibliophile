package com.bibliophile.services

import io.ktor.http.*
import java.sql.SQLException
import com.bibliophile.models.Follower
import com.bibliophile.repositories.FollowerRepository

class FollowerService(private val followerRepository: FollowerRepository) {

    suspend fun getAllFollows(): List<Follower> = followerRepository.getAllFollows()

    suspend fun getFollowersOfUser(userId: Int?): Pair<HttpStatusCode, Any> {
        if (userId == null) return HttpStatusCode.BadRequest to "User ID is required"
        val followers = followerRepository.getFollowersOfUser(userId)
        return HttpStatusCode.OK to followers
    }

    suspend fun getFollowingUsers(userId: Int?): Pair<HttpStatusCode, Any> {
        if (userId == null) return HttpStatusCode.BadRequest to "User ID is required"
        val following = followerRepository.getFollowingUsers(userId)
        return HttpStatusCode.OK to following
    }

    suspend fun isFollowing(followingId: Int?, followedId: Int?): Pair<HttpStatusCode, Any> {
        if (followingId == null || followedId == null) {
            return HttpStatusCode.BadRequest to "Both user IDs are required"
        }
        val isFollowing = followerRepository.isFollowing(followingId, followedId)
        return HttpStatusCode.OK to mapOf("isFollowing" to isFollowing)
    }

    suspend fun addFollow(follower: Follower): Pair<HttpStatusCode, String> {
        return try {
            validateFollowFields(follower)?.let { return it }

            // Verifica se já existe esse follow
            val alreadyFollows = followerRepository.isFollowing(
                follower.following_user_id,
                follower.followed_user_id
            )
            if (alreadyFollows) {
                return HttpStatusCode.Conflict to "User is already following this person"
            }

            followerRepository.addFollow(follower)
            HttpStatusCode.Created to "Follow created successfully"
        } catch (ex: SQLException) {
            HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
        } catch (ex: Exception) {
            HttpStatusCode.BadRequest to "Error creating follow: ${ex.message}"
        }
    }

    suspend fun deleteFollow(followingId: Int?, followedId: Int?): Pair<HttpStatusCode, String> {
        if (followingId == null || followedId == null) {
            return HttpStatusCode.BadRequest to "Both user IDs are required"
        }

        return try {
            val deleted = followerRepository.deleteFollow(followingId, followedId)
            if (deleted) {
                HttpStatusCode.OK to "Follow deleted successfully"
            } else {
                HttpStatusCode.NotFound to "Follow not found"
            }
        } catch (ex: SQLException) {
            HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
        } catch (ex: Exception) {
            HttpStatusCode.InternalServerError to "Error deleting follow: ${ex.message}"
        }
    }

    suspend fun deleteAllFollowsByUser(userId: Int?): Pair<HttpStatusCode, String> {
        if (userId == null) return HttpStatusCode.BadRequest to "User ID is required"
        return try {
            val deleted = followerRepository.deleteAllFollowsByUser(userId)
            if (deleted) {
                HttpStatusCode.OK to "All follows deleted for user"
            } else {
                HttpStatusCode.NotFound to "No follows found for user"
            }
        } catch (ex: SQLException) {
            HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
        }
    }

    suspend fun deleteAllFollowersOfUser(userId: Int?): Pair<HttpStatusCode, String> {
        if (userId == null) return HttpStatusCode.BadRequest to "User ID is required"
        return try {
            val deleted = followerRepository.deleteAllFollowersOfUser(userId)
            if (deleted) {
                HttpStatusCode.OK to "All followers deleted for user"
            } else {
                HttpStatusCode.NotFound to "No followers found for user"
            }
        } catch (ex: SQLException) {
            HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
        }
    }

    private fun validateFollowFields(follower: Follower): Pair<HttpStatusCode, String>? {
        return when {
            follower.following_user_id == follower.followed_user_id ->
                HttpStatusCode.BadRequest to "User cannot follow themselves"
            else -> null
        }
    }
}
