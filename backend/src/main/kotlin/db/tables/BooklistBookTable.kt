package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object BooklistBookTable : IntIdTable("booklist_book") {
    val isbn = varchar("isbn", 13)
    val booklistId = reference("booklist_id", BooklistTable)
}
