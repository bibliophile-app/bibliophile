package com.bibliophile.db

import org.flywaydb.core.Flyway
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction

object TestDatabaseFactory {

    private const val DB_URL = "jdbc:h2:mem:testdb;MODE=MySQL;DATABASE_TO_UPPER=false;DB_CLOSE_DELAY=-1"
    private const val DB_DRIVER = "org.h2.Driver"

    fun init() {
        val db = Database.connect(
            url = DB_URL,
            driver = DB_DRIVER
        )

        val flyway = Flyway.configure()
            .dataSource(DB_URL, null, null) 
            .locations("classpath:migrations")
            .load()
            .migrate()
    }

    fun reset() {
        val flyway = Flyway.configure()
            .dataSource(DB_URL, null, null)
            .locations("classpath:migrations")
            .load()
        
        flyway.clean() 
        
        flyway.migrate()
    }
}