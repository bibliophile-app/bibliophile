package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object BooklistsTable : IntIdTable("booklists") {
    val userId = integer("user_id")
    val listName = varchar("list_name", 50)
    val listDescription = varchar("list_description", 255).nullable()
}