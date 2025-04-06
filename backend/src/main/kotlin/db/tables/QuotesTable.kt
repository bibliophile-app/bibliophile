package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object QuotesTable : IntIdTable("quotes") {
    val userId = integer("user_id")
    val content = varchar("content", 255)
}