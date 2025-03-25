package com.bibliophile.db

import org.flywaydb.core.Flyway
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

import com.bibliophile.db.tables.*

object DatabaseFactory {
    
    private val DB_URL = System.getenv("DATABASE_URL")
    private val DB_USER =  System.getenv("DATABASE_USER")
    private val DB_PASSWORD = System.getenv("DATABASE_PASSWORD")

    fun init() {
        Database.connect(
            url = DB_URL,
            user = DB_USER,
            password = DB_PASSWORD
        )

        // Apply migrations with Flyway
        Flyway.configure()
            .dataSource(DB_URL, DB_USER, DB_PASSWORD)
            .load()
            .migrate()

        // To prevent Exposed errors, create missing tables and columns
        transaction {
            SchemaUtils.createMissingTablesAndColumns(BooklistsTable, BooklistBooksTable)
        }
    }
}
