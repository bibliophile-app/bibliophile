package dao

import models.User
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import tables.UsersTable

object UserDAO {

    fun getAllUsers(): List<User> = transaction {
        UsersTable.selectAll().map {
            User(
                id = it[UsersTable.id],
                username = it[UsersTable.username],
                name = it[UsersTable.name],
                passwordHash = it[UsersTable.passwordHash]
            )
        }
    }

    fun getUserById(userId: Int): User? = transaction {
        UsersTable.select { UsersTable.id eq userId }
            .map {
                User(
                    id = it[UsersTable.id],
                    username = it[UsersTable.username],
                    name = it[UsersTable.name],
                    passwordHash = it[UsersTable.passwordHash]
                )
            }.singleOrNull()
    }

    fun addUser(username: String, name: String, passwordHash: String): User = transaction {
        val userId = UsersTable.insertAndGetId {
            it[UsersTable.username] = username
            it[UsersTable.name] = name
            it[UsersTable.passwordHash] = passwordHash
        }.value

        User(userId, username, name, passwordHash)
    }

    fun deleteUser(userName: String): Boolean = transaction {
        UsersTable.deleteWhere { UsersTable.username eq userName } > 0
    }
    
}
