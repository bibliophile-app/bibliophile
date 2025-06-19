package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

import com.bibliophile.db.daoToModel
import com.bibliophile.models.User
import com.bibliophile.models.UserRequest
import com.bibliophile.models.UserProfileResponse
import com.bibliophile.db.entities.*
import com.bibliophile.db.tables.*
import com.bibliophile.db.suspendTransaction
import com.bibliophile.utils.*

object UserRepository {
    /** Retorna todos os usuários */
    suspend fun all(): List<User> = suspendTransaction {
        UserDAO.all().map(::daoToModel)
    }

    /** Busca um usuário pelo ID */
    suspend fun findById(id: Int): User? = suspendTransaction {
        UserDAO.findById(id)?.let(::daoToModel)
    }

    /** Busca um usuário pelo username */
    suspend fun findByUsername(username: String): User? = suspendTransaction {
        UserDAO.find { UsersTable.username eq username }
            .map(::daoToModel)
            .firstOrNull()
    }

    /** Busca perfil completo do usuário */
    suspend fun findProfileById(id: Int): UserProfileResponse? {
        val user = findById(id) ?: return null
        
        return UserProfileResponse(
            id = user.id,
            username = user.username,
            quotes = QuoteRepository.findByUserId(id)
        )
    }

    /** Adiciona um novo usuário */
    suspend fun add(request: UserRequest): User {
        val user = suspendTransaction {
            UserDAO.new {
                email = request.email
                username = request.username
                passwordHash = hashPassword(request.password)
            }.let(::daoToModel)
        }

        return user
    }

    /** Atualiza um usuário existente */
    suspend fun update(id: Int, request: UserRequest): Boolean = suspendTransaction {
        val userDAO = UserDAO.findById(id)
        if (userDAO != null) {
            userDAO.apply {
                username = request.username
                passwordHash = request.password
            }
            true
        } else false
    }

    /** Remove um usuário */
    suspend fun delete(id: Int): Boolean = suspendTransaction {
        UsersTable.deleteWhere { UsersTable.id eq id } > 0
    }

    /** Autentica um usuário */
    suspend fun authenticate(username: String, password: String): User? {
        val user = findByUsername(username)
        return if (user != null && verifyPassword(password, user.passwordHash)) user else null
    }
}