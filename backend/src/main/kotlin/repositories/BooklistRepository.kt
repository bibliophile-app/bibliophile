package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.and

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

    suspend fun booklist(booklistId: Int): Booklist? = suspendTransaction {
        BooklistDAO.findById(booklistId)?.let(::daoToModel)
    }

    suspend fun addBooklist(booklist: Booklist): Unit = suspendTransaction {
        BooklistDAO.new {
            userId = booklist.userId
            listName = booklist.listName
            listDescription = booklist.listDescription
        }
    }

    suspend fun updateBooklist(booklistId: Int, updatedBooklist: Booklist): Boolean = suspendTransaction {
        val booklistDao = BooklistDAO.findById(booklistId) ?: return@suspendTransaction false
        booklistDao.apply {
            userId = updatedBooklist.userId
            listName = updatedBooklist.listName
            listDescription = updatedBooklist.listDescription
        }
        true
    }

    suspend fun removeBooklist(booklistId: Int): Boolean = suspendTransaction {
        BooklistBooksTable.deleteWhere { BooklistBooksTable.booklistId eq booklistId }
        BooklistsTable.deleteWhere { id eq booklistId } > 0
    }

    suspend fun booklistWithBooks(booklistId: Int): BooklistWithBooks? = suspendTransaction {
        val booklistDao = BooklistDAO.findById(booklistId) ?: return@suspendTransaction null
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

    suspend fun addBookToBooklist(booklistId: Int, bookISBN: String): Boolean = suspendTransaction {
        val booklistDao = BooklistDAO.findById(booklistId) ?: return@suspendTransaction false
        
        BooklistBookDAO.new {
            this.booklistId = booklistDao.id
            this.isbn = bookISBN
        }
        true
    }

    suspend fun removeBookFromBooklist(booklistId: Int, bookISBN: String): Boolean = suspendTransaction {
        BooklistBooksTable.deleteWhere { (BooklistBooksTable.booklistId eq booklistId) and (BooklistBooksTable.isbn eq bookISBN) } > 0
    }
}