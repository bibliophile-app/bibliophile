package com.bibliophile.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import com.bibliophile.db.tables.BooklistTable
import com.bibliophile.db.tables.BooklistBookTable

class BooklistBookDAO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<BooklistBookDAO>(BooklistBookTable)

    var isbn by BooklistBookTable.isbn
    var booklist by BooklistBookTable.booklistId
}
