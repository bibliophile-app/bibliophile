package com.bibliophile.repositories


import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Follower
import com.bibliophile.db.entities.FollowerDAO
import com.bibliophile.db.tables.FollowersTable
import com.bibliophile.db.suspendTransaction

class FollowerRepository {

    // Retorna todos os follows
    suspend fun getAllFollows(): List<Follower> = suspendTransaction {
        FollowersTable.selectAll().map { rowToFollower(it) }
    }

    // Retorna seguidores de um usuário
    suspend fun getFollowersOfUser(userId: Int): List<Follower> = suspendTransaction {
        FollowersTable
            .select { FollowersTable.followed_user_id eq userId }
            .map { rowToFollower(it) }
    }

    // Retorna quem o usuário está seguindo
    suspend fun getFollowingUsers(userId: Int): List<Follower> = suspendTransaction {
        FollowersTable
            .select { FollowersTable.following_user_id eq userId }
            .map { rowToFollower(it) }
    }

    // Adiciona um novo follow
    suspend fun addFollow(follower: Follower): Follower = suspendTransaction {
        val insertedId = FollowersTable.insertAndGetId { table ->
            table[following_user_id] = follower.following_user_id
            table[followed_user_id] = follower.followed_user_id
        }

        follower.copy(id = insertedId.value)
    }

    // Verifica se um usuário segue outro
    suspend fun isFollowing(followingId: Int, followedId: Int): Boolean = suspendTransaction {
        FollowersTable
            .select {
                (FollowersTable.following_user_id eq followingId) and 
                (FollowersTable.followed_user_id eq followedId)
            }
            .count() > 0
    }

    // Remove um follow específico
    suspend fun deleteFollow(followingId: Int, followedId: Int): Boolean = suspendTransaction {
        val deletedRows = FollowersTable.deleteWhere {
            (FollowersTable.following_user_id eq followingId) and 
            (FollowersTable.followed_user_id eq followedId)
        }
        deletedRows > 0
    }

    // Remove todos os follows de um usuário
    suspend fun deleteAllFollowsByUser(userId: Int): Boolean = suspendTransaction {
        val deletedRows = FollowersTable.deleteWhere {
            FollowersTable.following_user_id eq userId
        }
        deletedRows > 0
    }

    // Remove todos os seguidores de um usuário
    suspend fun deleteAllFollowersOfUser(userId: Int): Boolean = suspendTransaction {
        val deletedRows = FollowersTable.deleteWhere {
            FollowersTable.followed_user_id eq userId
        }
        deletedRows > 0
    }

    // Conversão interna de ResultRow para Follower

    private fun rowToFollower(row: ResultRow): Follower {

        return Follower(

            id = row[FollowersTable.id].value,

            following_user_id = row[FollowersTable.following_user_id],

            followed_user_id = row[FollowersTable.followed_user_id]

        )

    }
}