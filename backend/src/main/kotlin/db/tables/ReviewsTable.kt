package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.javatime.date

object ReviewsTable : IntIdTable("reviews") {
    val userId = reference(
        name = "user_id",
        foreign = UsersTable,
        onDelete = ReferenceOption.CASCADE
    )
    val bookId = varchar("book_id", 132)
    val content = varchar("content", 255)
    val rate = integer("rate")
    val favorite = bool("favorite").default(false)
    val reviewedAt = date("reviewed_at")
}