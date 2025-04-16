package com.bibliophile.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import com.bibliophile.db.tables.ReviewsTable

class ReviewDAO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ReviewDAO>(ReviewsTable)

    var isbn by ReviewsTable.isbn
    var userId by ReviewsTable.userId
    var content by ReviewsTable.content
    var rating by ReviewsTable.rating
    var favorite by ReviewsTable.favorite
}