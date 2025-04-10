package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object ReviewsTable : IntIdTable("reviews") {
    val userId = reference(
        name = "user_id",
        foreign = UsersTable,
        onDelete = ReferenceOption.CASCADE
    )
    val isbn = varchar("isbn", 13)
    val content = varchar("content", 255)
    val rate = integer("rate")
    val favorite = bool("favorite")
}