package com.bibliophile.repositories

import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.dao.id.EntityID

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Follow
import com.bibliophile.models.FollowRequest
import com.bibliophile.db.entities.FollowerDAO
import com.bibliophile.db.tables.FollowersTable
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.suspendTransaction

object FollowerRepository {
    /** Retorna todas as relações de follow */
    suspend fun all(): List<Follow> = suspendTransaction {
        FollowerDAO.all().map(::daoToModel)
    }

    /** Busca seguidores de um usuário */
    suspend fun findByFolloweeId(userId: Int): List<Follow> = suspendTransaction {
        FollowerDAO.find { FollowersTable.followeeId eq userId }
            .map(::daoToModel)
    }

    /** Busca quem um usuário segue */
    suspend fun findByFollowerId(userId: Int): List<Follow> = suspendTransaction {
        FollowerDAO.find { FollowersTable.followerId eq userId }
            .map(::daoToModel)
    }

    /** Adiciona um novo follow */
    suspend fun add(userId: Int, request: FollowRequest): Follow = suspendTransaction {
        FollowerDAO.new {
            followerId = EntityID(userId, UsersTable)
            followeeId = EntityID(request.followeeId, UsersTable)
        }.let(::daoToModel)
    }

    /** Verifica se existe relação de follow */
    suspend fun exists(followerId: Int, followeeId: Int): Boolean = suspendTransaction {
        FollowerDAO.find {
            (FollowersTable.followerId eq followerId) and
            (FollowersTable.followeeId eq followeeId)
        }.any()
    }

    /** Remove um follow */
    suspend fun delete(userId: Int, request: FollowRequest): Boolean = suspendTransaction {
        val toDelete = FollowerDAO.find {
            (FollowersTable.followerId eq userId) and
            (FollowersTable.followeeId eq request.followeeId)
        }
        toDelete.map { it.delete(); it }.isNotEmpty()
    }
}