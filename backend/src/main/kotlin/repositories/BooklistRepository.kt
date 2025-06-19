package com.bibliophile.repositories

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import com.bibliophile.models.Booklist
import com.bibliophile.models.BooklistRequest
import com.bibliophile.models.BooklistWithBooks
import com.bibliophile.db.entities.BooklistDAO
import com.bibliophile.db.entities.BooklistBookDAO
import com.bibliophile.db.tables.BooklistsTable
import com.bibliophile.db.tables.BooklistBooksTable
import com.bibliophile.db.tables.UsersTable
import com.bibliophile.db.suspendTransaction

object BooklistRepository {
    /** Retorna todas as booklists */
    suspend fun all(): List<Booklist> = suspendTransaction {
        (BooklistsTable innerJoin UsersTable)
            .selectAll()
            .map { row ->
                Booklist(
                    id = row[BooklistsTable.id].value,
                    username = row[UsersTable.username],
                    listName = row[BooklistsTable.listName],
                    listDescription = row[BooklistsTable.listDescription] ?: "",
                )
            }
    }

    /** Busca uma booklist pelo ID */
    suspend fun findById(id: Int): Booklist? = suspendTransaction {
        (BooklistsTable innerJoin UsersTable)
            .select { BooklistsTable.id eq id }
            .singleOrNull()
            ?.let { row ->
                Booklist(
                    id = row[BooklistsTable.id].value,
                    username = row[UsersTable.username],
                    listName = row[BooklistsTable.listName],
                    listDescription = row[BooklistsTable.listDescription] ?: "",
                )
            }
    }

    /** Busca booklists por usuário, incluindo os livros */
    suspend fun findByUserId(userId: Int): List<BooklistWithBooks> = suspendTransaction {
        val username = UsersTable
            .select { UsersTable.id eq userId }
            .singleOrNull()?.get(UsersTable.username) ?: return@suspendTransaction emptyList()

        BooklistDAO.find { BooklistsTable.userId eq userId }
            .map { booklistDAO ->
                val books = BooklistBookDAO.find { BooklistBooksTable.booklistId eq booklistDAO.id }
                    .map { it.bookId }
                BooklistWithBooks(
                    id = booklistDAO.id.value,
                    username = username,
                    listName = booklistDAO.listName,
                    listDescription = booklistDAO.listDescription ?: "",
                    books = books
                )
            }
    }

    /** Retorna uma booklist com seus livros */
    suspend fun findWithBooks(id: Int): BooklistWithBooks? = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(id) ?: return@suspendTransaction null
        val books = BooklistBookDAO.find { BooklistBooksTable.booklistId eq booklistDAO.id }
            .map { it.bookId }

        val username = UsersTable
            .select { UsersTable.id eq booklistDAO.userId.value }
            .single()[UsersTable.username]

        BooklistWithBooks(
            id = booklistDAO.id.value,
            username = username,
            listName = booklistDAO.listName,
            listDescription = booklistDAO.listDescription ?: "",
            books = books
        )
    }

    /** Adiciona uma nova booklist */
    suspend fun add(userId: Int, request: BooklistRequest): Booklist = suspendTransaction {
        val booklistDAO = BooklistDAO.new {
            this.userId = EntityID(userId, UsersTable) 
            listName = request.listName
            listDescription = request.listDescription
        }

        val username = UsersTable
            .select { UsersTable.id eq userId }
            .single()[UsersTable.username]

        Booklist(
            id = booklistDAO.id.value,
            username = username,
            listName = booklistDAO.listName,
            listDescription = booklistDAO.listDescription ?: "",
        )
    }

    /** Atualiza uma booklist existente */
    suspend fun update(id: Int, userId: Int, request: BooklistRequest): Boolean = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(id)
        if (booklistDAO != null && 
            booklistDAO.userId.value == userId && 
            booklistDAO.listName != "___DEFAULT___") {
            booklistDAO.apply {
                listName = request.listName
                listDescription = request.listDescription
            }
            true
        } else false
    }

    /** Deleta uma booklist */
    suspend fun delete(id: Int, userId: Int): Boolean = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(id)
        if (booklistDAO != null && 
            booklistDAO.userId.value == userId && 
            booklistDAO.listName != "___DEFAULT___") {
            booklistDAO.delete()
            true
        } else false
    }

    /** Adiciona um livro à booklist */
    suspend fun addBookToList(listId: Int, userId: Int, bookId: String): Boolean = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(listId)
        if (booklistDAO != null && booklistDAO.userId.value == userId) {
            BooklistBookDAO.new {
                this.booklistId = booklistDAO.id
                this.bookId = bookId
            }
            true
        } else false
    }

    /** Remove um livro da booklist */
    suspend fun removeBookFromList(listId: Int, userId: Int, bookId: String): Boolean = suspendTransaction {
        val booklistDAO = BooklistDAO.findById(listId)
        if (booklistDAO != null && booklistDAO.userId.value == userId) {
            BooklistBooksTable.deleteWhere {
                (BooklistBooksTable.booklistId eq listId) and
                (BooklistBooksTable.bookId eq bookId)
            } > 0
        } else false
    }


    /* Busca lista default com livros */
    suspend fun findDefault(userId: Int): BooklistWithBooks? = suspendTransaction {
        val booklistDAO = BooklistDAO.find {
            (BooklistsTable.userId eq userId) and
            (BooklistsTable.listName eq "___DEFAULT___")
        }.firstOrNull() ?: return@suspendTransaction null

        val books = BooklistBookDAO.find { BooklistBooksTable.booklistId eq booklistDAO.id }
            .map { it.bookId }

        val username = UsersTable
            .select { UsersTable.id eq booklistDAO.userId.value }
            .single()[UsersTable.username]

        BooklistWithBooks(
            id = booklistDAO.id.value,
            username = username,
            listName = booklistDAO.listName,
            listDescription = booklistDAO.listDescription ?: "",
            books = books
        )
    }

    /* Adiciona lista default */
    suspend fun addDefault(userId: Int) = suspendTransaction {
        val alreadyExists = BooklistDAO.find {
            (BooklistsTable.userId eq userId) and
            (BooklistsTable.listName eq "___DEFAULT___")
        }.empty().not()

        if (!alreadyExists) {
            BooklistDAO.new {
                this.userId = EntityID(userId, UsersTable)
                this.listName = "___DEFAULT___"
                this.listDescription = ""
            }
        }
    }
}