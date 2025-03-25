package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Booklist
import com.bibliophile.models.BooklistWithBooks
import com.bibliophile.db.entities.BooklistDAO
import com.bibliophile.db.entities.BooklistBookDAO
import com.bibliophile.db.tables.BooklistsTable
import com.bibliophile.db.tables.BooklistBooksTable
import com.bibliophile.db.suspendTransaction

class BooklistRepository {

    suspend fun allBooklists(): List<Booklist> = suspendTransaction {
        BooklistDAO.all().map(::daoToModel)
    }

    suspend fun booklistByName(name: String): Booklist?  = suspendTransaction {
        BooklistDAO
            .find { (BooklistsTable.listName eq name) }
            .limit(1)
            .map(::daoToModel)
            .firstOrNull()
    }
    
    suspend fun addBooklist(booklist: Booklist): Unit = suspendTransaction {
        BooklistDAO.new {
            userId = booklist.userId
            listName = booklist.listName
            listDescription = booklist.listDescription
        }
    }    

    suspend fun removeBooklist(name: String): Boolean = suspendTransaction {
        val rowsDeleted = BooklistsTable.deleteWhere {
            BooklistsTable.listName eq name
        }
        rowsDeleted == 1
    }

    suspend fun booklistWithBooks(name: String): BooklistWithBooks? = suspendTransaction {
        val booklistDao = BooklistDAO.find { BooklistsTable.listName eq name }.firstOrNull() ?: return@suspendTransaction null
        val books = BooklistBookDAO.find { BooklistBooksTable.booklistId eq booklistDao.id }
            .map { it.isbn }
        
        BooklistWithBooks(
            id = booklistDao.id.value,
            userId = booklistDao.userId,
            listName = booklistDao.listName,
            listDescription = booklistDao.listDescription ?: "",
            books = books
        )
    }
}