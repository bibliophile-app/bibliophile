package com.bibliophile.db

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

import com.bibliophile.models.Booklist

object BooklistTable : IntIdTable("booklist") {
    val userId = integer("user_id")
    val name = varchar("name", 50)
    val description = varchar("description", 255).nullable()
}

class BooklistDAO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<BooklistDAO>(BooklistTable)

    var userId by BooklistTable.userId
    var name by BooklistTable.name
    var description by BooklistTable.description
}

suspend fun <T> suspendTransaction(block: Transaction.() -> T): T =
    newSuspendedTransaction(Dispatchers.IO, statement = block)

fun daoToModel(dao: BooklistDAO) = Booklist(
    dao.id.value,
    dao.userId,
    dao.name,
    dao.description ?: "",
)