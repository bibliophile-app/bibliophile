package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Booklist
import com.bibliophile.models.BooklistWithBooks
import com.bibliophile.db.entities.BooklistDAO
import com.bibliophile.db.entities.BooklistBookDAO
import com.bibliophile.db.tables.BooklistTable
import com.bibliophile.db.tables.BooklistBookTable
import com.bibliophile.db.suspendTransaction

class BooklistRepository {

    suspend fun allBooklists(): List<Booklist> = suspendTransaction {
        BooklistDAO.all().map(::daoToModel)
    }

    suspend fun booklistByName(name: String): Booklist?  = suspendTransaction {
        BooklistDAO
            .find { (BooklistTable.name eq name) }
            .limit(1)
            .map(::daoToModel)
            .firstOrNull()
    }
    
    suspend fun addBooklist(booklist: Booklist): Unit = suspendTransaction {
        BooklistDAO.new {
            userId = booklist.userId
            name = booklist.name
            description = booklist.description
        }
    }    

    suspend fun removeBooklist(name: String): Boolean = suspendTransaction {
        val rowsDeleted = BooklistTable.deleteWhere {
            BooklistTable.name eq name
        }
        rowsDeleted == 1
    }

    suspend fun booklistWithBooks(name: String): BooklistWithBooks? = suspendTransaction {
        val booklistDao = BooklistDAO.find { BooklistTable.name eq name }.firstOrNull() ?: return@suspendTransaction null
        val books = BooklistBookDAO.find { BooklistBookTable.booklistId eq booklistDao.id }
            .map { it.isbn }
        
        BooklistWithBooks(
            id = booklistDao.id.value,
            userId = booklistDao.userId,
            name = booklistDao.name,
            description = booklistDao.description ?: "",
            books = books
        )
    }
}