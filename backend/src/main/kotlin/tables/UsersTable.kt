package com.bibliophile.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object Users : IntIdTable("users") {
    val name = varchar("name", 100)
    val username = varchar("username", 50).uniqueIndex() 
    val password = varchar("password_hash", 255)
 
}