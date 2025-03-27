package com.bibliophile.db

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import com.bibliophile.db.tables.UsersTable

object DatabaseFactory {
    fun init() {
        val dbUrl = System.getenv("DATABASE_URL") ?: "jdbc:mariadb://localhost:3306/meu_banco"
        val dbUser = System.getenv("DATABASE_USER") ?: "user"
        val dbPassword = System.getenv("DATABASE_PASSWORD") ?: "password"

        Database.connect(
            url = dbUrl,
            driver = "org.mariadb.jdbc.Driver",
            user = dbUser,
            password = dbPassword
        )

    }
}
