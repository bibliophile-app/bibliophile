package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.and

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Booklist
import com.bibliophile.models.BooklistRequest
import com.bibliophile.models.BooklistWithBooks
import com.bibliophile.db.entities.BooklistDAO
import com.bibliophile.db.entities.BooklistBookDAO
import com.bibliophile.db.tables.BooklistsTable
import com.bibliophile.db.tables.BooklistBooksTable
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.suspendTransaction

class BooklistRepository {

    /** Retorna todas as booklists */
    suspend fun allBooklists(): List<Booklist> = suspendTransaction {
        BooklistDAO.all().map(::daoToModel)
    }

    /** Busca uma booklist pelo ID */
    suspend fun booklist(booklistId: Int): Booklist? = suspendTransaction {
        BooklistDAO.findById(booklistId)?.let(::daoToModel)
    }

    /** Adiciona uma nova booklist */
    suspend fun addBooklist(userId: Int, booklist: BooklistRequest): Unit = suspendTransaction {
        BooklistDAO.new {
            this.userId = EntityID(userId, UsersTable) 
            listName = booklist.listName
            listDescription = booklist.listDescription
        }
    }

    /** Atualiza uma booklist existente */
    suspend fun updateBooklist(booklistId: Int, userId: Int, updatedBooklist: BooklistRequest): Boolean = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(booklistId)
        if (booklistDAO != null && booklistDAO.userId.value == userId) {
            booklistDAO.apply {
                listName = updatedBooklist.listName
                listDescription = updatedBooklist.listDescription
            }
            true
        } else {
            false
        }
    }

    /** Deleta uma booklist pelo ID e ID do usuário */
    suspend fun removeBooklist(booklistId: Int, userId: Int): Boolean = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(booklistId)
        if (booklistDAO != null && booklistDAO.userId.value == userId) {
            booklistDAO.delete()
            true
        } else {
            false
        }
    }

    /** Retorna uma booklist com os livros associados */
    suspend fun booklistWithBooks(booklistId: Int): BooklistWithBooks? = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(booklistId) ?: return@suspendTransaction null
        val books = BooklistBookDAO.find { BooklistBooksTable.booklistId eq booklistDAO.id }
            .map { it.isbn }

        BooklistWithBooks(
            id = booklistDAO.id.value,
            userId = booklistDAO.userId.value,
            listName = booklistDAO.listName,
            listDescription = booklistDAO.listDescription ?: "",
            books = books
        )
    }

    /** Adiciona um livro à booklist, se ela pertencer ao usuário */
    suspend fun addBookToBooklist(booklistId: Int, userId: Int, bookISBN: String): Boolean = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(booklistId)
        if (booklistDAO != null && booklistDAO.userId.value == userId) {
            BooklistBookDAO.new {
                this.booklistId = booklistDAO.id
                this.isbn = bookISBN
            }
            true
        } else {
            false
        }
    }

    /** Remove um livro da booklist, se ela pertencer ao usuário */
    suspend fun removeBookFromBooklist(booklistId: Int, userId: Int, bookISBN: String): Boolean = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(booklistId)
        if (booklistDAO != null && booklistDAO.userId.value == userId) {
            BooklistBooksTable.deleteWhere {
                (BooklistBooksTable.booklistId eq booklistId) and
                (BooklistBooksTable.isbn eq bookISBN)
            } > 0
        } else {
            false
        }
    }
}
