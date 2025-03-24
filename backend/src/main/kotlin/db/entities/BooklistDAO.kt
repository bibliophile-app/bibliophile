package com.bibliophile.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import com.bibliophile.db.tables.BooklistTable

class BooklistDAO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<BooklistDAO>(BooklistTable)

    var userId by BooklistTable.userId
    var name by BooklistTable.name
    var description by BooklistTable.description
}
