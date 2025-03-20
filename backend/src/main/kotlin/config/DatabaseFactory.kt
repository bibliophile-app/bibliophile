package com.bibliophile.config

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.github.cdimascio.dotenv.dotenv
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import com.bibliophile.models.Users

object DatabaseFactory {
    private val dotenv = dotenv()

    fun init() {
        Database.connect(hikari())

        transaction {
            SchemaUtils.create(Users) // Criação automática da tabela
        }
    }

    private fun hikari(): HikariDataSource {
        val config = HikariConfig().apply {
            jdbcUrl = dotenv["DB_URL"] ?: "jdbc:mariadb://localhost:3306/defaultdb"
            driverClassName = "org.mariadb.jdbc.Driver"
            username = dotenv["DB_USER"] ?: "root"
            password = dotenv["DB_PASSWORD"] ?: ""
            maximumPoolSize = dotenv["DB_POOL_SIZE"]?.toInt() ?: 10
        }
        return HikariDataSource(config)
    }
}
