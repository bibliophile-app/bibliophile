package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object BooklistTable : IntIdTable("booklist") {
    val userId = integer("user_id")
    val name = varchar("name", 50)
    val description = varchar("description", 255).nullable()
}