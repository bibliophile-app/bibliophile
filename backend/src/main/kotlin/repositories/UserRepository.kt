package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

import com.bibliophile.db.daoToModel
import com.bibliophile.models.User
import com.bibliophile.db.entities.UserDAO
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.suspendTransaction

class UserRepository {

    /** Retorna todos os usuários do banco */
    suspend fun getAllUsers(): List<User> = suspendTransaction {
        UserDAO.all().map(::daoToModel)
    }

    /** Busca um usuário pelo ID */
    suspend fun getUserById(id: Int): User? = suspendTransaction {
        UserDAO.findById(id)?.let(::daoToModel)
    }

    /** Busca um usuário pelo username */
    suspend fun getUserByUsername(username: String): User? = suspendTransaction {
        UserDAO.find { UsersTable.username eq username }
            .map(::daoToModel)
            .firstOrNull()
    }

    /** Adiciona um novo usuário e retorna o usuário criado */
    suspend fun addUser(user: User): User = suspendTransaction {
        UserDAO.new {
            this.username = user.username
            this.passwordHash = user.passwordHash
        }.let(::daoToModel)
    }

    suspend fun updateUsername(user: User): Boolean = suspendTransaction {
        val userDAO = UserDAO.findById(user.id!!)
        if (userDAO != null) {
            userDAO.username = user.username
            userDAO.passwordHash = user.passwordHash
            true
        } else {
            false
        }
    }
    
    /** Deleta um usuário pelo ID */
    suspend fun deleteUserById(id: Int): Boolean = suspendTransaction {
        val deletedRows = UsersTable.deleteWhere { UsersTable.id eq id }
        deletedRows > 0
    }

    /** Deleta um usuário pelo username */
    suspend fun deleteUserByUsername(username: String): Boolean = suspendTransaction {
        val deletedRows = UsersTable.deleteWhere { UsersTable.username eq username }
        deletedRows > 0
    }
}