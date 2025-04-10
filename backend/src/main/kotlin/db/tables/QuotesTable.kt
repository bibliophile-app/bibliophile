package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object QuotesTable : IntIdTable("quotes") {
    val userId = val userId = reference(
        name = "user_id",
        foreign = UsersTable,
        onDelete = ReferenceOption.CASCADE
    )
    val content = varchar("content", 255)
}