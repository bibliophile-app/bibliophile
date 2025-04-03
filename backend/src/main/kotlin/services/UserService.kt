package com.bibliophile.services

import io.ktor.http.*
import java.sql.SQLException
import com.bibliophile.models.User
import com.bibliophile.repositories.UserRepository

class UserService(private val userRepository: UserRepository) {

    suspend fun getAllUsers(): List<User> = userRepository.getAllUsers()

    suspend fun getUserByUsername(username: String?): Pair<HttpStatusCode, Any> {
        if (username.isNullOrBlank()) return HttpStatusCode.BadRequest to "Username is required"
        val user = userRepository.getUserByUsername(username)
        return user?.let { HttpStatusCode.OK to it } ?: HttpStatusCode.NotFound to "User not found"
    }

    suspend fun addUser(user: User): Pair<HttpStatusCode, String> {
        return try {
            userRepository.addUser(user)
            HttpStatusCode.Created to "User created successfully"
        } catch (ex: SQLException) {
            if (ex.message?.contains("unique constraint") == true) {
                HttpStatusCode.Conflict to "Username already exists"
            } else {
                HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
            }
        } catch (ex: Exception) {
            HttpStatusCode.BadRequest to "Error creating user: ${ex.message}"
        }
    }

    suspend fun updateUsername(userId: Int?, updatedUser: User): Pair<HttpStatusCode, String> {
        if (userId == null) {
            return HttpStatusCode.BadRequest to "User ID is required"
        }
        return try {
            val updated = userRepository.updateUsername(updatedUser.copy(id = userId))
            if (updated) {
                HttpStatusCode.OK to "User updated successfully"
            } else {
                HttpStatusCode.NotFound to "User not found"
            }
        } catch (ex: SQLException) {
            handleSQLException(ex)
        } catch (ex: Exception) {
            HttpStatusCode.BadRequest to "Error updating user: ${ex.message}"
        }
    }

    suspend fun deleteUserById(userId: Int?): Pair<HttpStatusCode, String> {
        if (userId == null) return HttpStatusCode.BadRequest to "User ID is required"
        return if (userRepository.deleteUserById(userId)) {
            HttpStatusCode.OK to "User deleted successfully"
        } else {
            HttpStatusCode.NotFound to "User not found"
        }
    }

    private fun handleSQLException(ex: SQLException): Pair<HttpStatusCode, String> {
        return if (ex.message?.contains("constraint") == true) {
            HttpStatusCode.Conflict to "Conflict with existing entry"
        } else {
            HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
        }
    }
}
