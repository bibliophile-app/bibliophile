package com.bibliophile.models

import org.jetbrains.exposed.sql.ResultRow

data class User(
    val id: Int,
    val username: String,
    val name: String,
    val password: String
) {
    companion object {
        fun fromRow(row: ResultRow) = User(
            id = row[Users.id].value, 
            username = row[Users.username],
            name = row[Users.name],
            password = row[Users.password_hash]
        )
    }
}
