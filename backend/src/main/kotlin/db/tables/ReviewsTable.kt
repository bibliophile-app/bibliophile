package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object ReviewsTable : IntIdTable("reviews") {

    val isbn = varchar("isbn", 13)
    val userId = integer("user_id")
    val content = varchar("content", 255)
    val rate = integer("rate")
    val favorite = bool("favorite")
}