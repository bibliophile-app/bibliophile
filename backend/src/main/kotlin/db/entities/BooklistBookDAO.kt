package com.bibliophile.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import com.bibliophile.db.tables.BooklistsTable
import com.bibliophile.db.tables.BooklistBooksTable

class BooklistBookDAO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<BooklistBookDAO>(BooklistBooksTable)

    var isbn by BooklistBooksTable.isbn
    var booklist by BooklistBooksTable.booklistId
}
