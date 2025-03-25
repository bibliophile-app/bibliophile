package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object BooklistBooksTable : IntIdTable("booklist_books") {
    val isbn = varchar("isbn", 13)
    val booklistId = reference("booklist_id", BooklistsTable)
}
