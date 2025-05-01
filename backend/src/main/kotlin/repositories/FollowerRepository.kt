package com.bibliophile.repositories

import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.dao.id.EntityID


import com.bibliophile.db.daoToModel
import com.bibliophile.models.Follower
import com.bibliophile.models.FollowerRequest
import com.bibliophile.db.entities.FollowerDAO
import com.bibliophile.db.tables.FollowersTable
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.suspendTransaction




class FollowerRepository {

    // retorna todas as relações de follow 
    suspend fun getAllFollows(): List<Follower> = suspendTransaction {
        FollowerDAO.all().map(::daoToModel)
    }

    // retorna a lista de usuários que seguem um determinado usuário
    suspend fun getFollowersOfUser(userId: Int): List<Follower> = suspendTransaction {
        FollowerDAO.find { FollowersTable.followeeId eq userId }
                   .map(::daoToModel)
    }

    // obtém a lista de usuários que um determinado usuário está seguindo
    suspend fun getFollowingUsers(userId: Int): List<Follower> = suspendTransaction {
        FollowerDAO.find { FollowersTable.followerId eq userId }
                   .map(::daoToModel)
    }

    // cria uma nova relação de follow entre dois usuários
    suspend fun addFollow(follower: FollowerRequest): Follower = suspendTransaction {
        FollowerDAO.new {
            followerId = EntityID(follower.followerId, UsersTable)
            followeeId  = EntityID(follower.followeeId, UsersTable)
        }.let(::daoToModel)
    }

    // verifica se um usuário já está seguindo outro
    suspend fun isFollowing(followerId: Int, followeeId: Int): Boolean = suspendTransaction {
        FollowerDAO.find {
            (FollowersTable.followerId eq followerId) and
            (FollowersTable.followeeId  eq followeeId)
        }.any()
    }

    // exclui uma relação de follow
    suspend fun deleteFollow(followerId: Int, followedId: Int): Boolean = suspendTransaction {
        val toDelete = FollowerDAO.find {
            (FollowersTable.followerId eq followerId) and
            (FollowersTable.followeeId  eq followedId)
        }
        toDelete.map { it.delete(); it }.isNotEmpty()
    }

    // exclui todas as relações de follow iniciadas por um determinado usuário.
    suspend fun deleteAllFollowsByUser(userId: Int): Boolean = suspendTransaction {
        val entries = FollowerDAO.find { FollowersTable.followerId eq userId }
        entries.map { it.delete() }.isNotEmpty()
    }

    // exclui todos os seguidores de um determinado usuário.
    suspend fun deleteAllFollowersOfUser(userId: Int): Boolean = suspendTransaction {
        val entries = FollowerDAO.find { FollowersTable.followeeId eq userId }
        entries.map { it.delete() }.isNotEmpty()
    }
}