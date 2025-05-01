package com.bibliophile.repositories

import com.bibliophile.db.daoToModel
import com.bibliophile.db.entities.FollowerDAO
import com.bibliophile.db.tables.FollowersTable
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.suspendTransaction
import com.bibliophile.models.Follower
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SqlExpressionBuilder.and

class FollowerRepository {

    suspend fun getAllFollows(): List<Follower> = suspendTransaction {
        FollowerDAO.all().map(::daoToModel)
    }

    suspend fun getFollowersOfUser(userId: Int): List<Follower> = suspendTransaction {
        FollowerDAO.find { FollowersTable.followedUser eq userId }
                   .map(::daoToModel)
    }

    suspend fun getFollowingUsers(userId: Int): List<Follower> = suspendTransaction {
        FollowerDAO.find { FollowersTable.followingUser eq userId }
                   .map(::daoToModel)
    }

    suspend fun addFollow(follower: Follower): Follower = suspendTransaction {
        FollowerDAO.new {
            followingUser = EntityID(follower.following_user_id, UsersTable)
            followedUser  = EntityID(follower.followed_user_id,  UsersTable)
        }.let(::daoToModel)
    }

    suspend fun isFollowing(followingId: Int, followedId: Int): Boolean = suspendTransaction {
        FollowerDAO.find {
            (FollowersTable.followingUser eq followingId) and
            (FollowersTable.followedUser  eq followedId)
        }.any()
    }

    suspend fun deleteFollow(followingId: Int, followedId: Int): Boolean = suspendTransaction {
        val toDelete = FollowerDAO.find {
            (FollowersTable.followingUser eq followingId) and
            (FollowersTable.followedUser  eq followedId)
        }
        toDelete.map { it.delete(); it }.isNotEmpty()
    }

    suspend fun deleteAllFollowsByUser(userId: Int): Boolean = suspendTransaction {
        val entries = FollowerDAO.find { FollowersTable.followingUser eq userId }
        entries.map { it.delete() }.isNotEmpty()
    }

    suspend fun deleteAllFollowersOfUser(userId: Int): Boolean = suspendTransaction {
        val entries = FollowerDAO.find { FollowersTable.followedUser eq userId }
        entries.map { it.delete() }.isNotEmpty()
    }
}