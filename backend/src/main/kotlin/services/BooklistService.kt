package com.bibliophile.services

import io.ktor.http.*
import java.sql.SQLException
import com.bibliophile.models.Booklist
import com.bibliophile.models.BooklistBook
import com.bibliophile.repositories.BooklistRepository

class BooklistService {

    private val booklistRepository = BooklistRepository()

    suspend fun getAllBooklists(): List<Booklist> = booklistRepository.allBooklists()

    suspend fun getBooklistById(id: String?): Pair<HttpStatusCode, Any> {
        if (id.isNullOrBlank()) return HttpStatusCode.BadRequest to "Booklist ID is required"
        val booklist = booklistRepository.booklist(id.toInt())
        return booklist?.let { HttpStatusCode.OK to it } ?: HttpStatusCode.NotFound to "Booklist not found"
    }

    suspend fun getBooklistWithBooks(id: String?): Pair<HttpStatusCode, Any> {
        if (id.isNullOrBlank()) return HttpStatusCode.BadRequest to "Booklist ID is required"
        val booklist = booklistRepository.booklistWithBooks(id.toInt())
        return booklist?.let { HttpStatusCode.OK to it } ?: HttpStatusCode.NotFound to "Booklist not found"
    }

    suspend fun addBooklist(booklist: Booklist): Pair<HttpStatusCode, String> {
        return try {
            booklistRepository.addBooklist(booklist)
            HttpStatusCode.Created to "Booklist created successfully"
        } catch (ex: SQLException) {
            if (ex.message?.contains("unique constraint") == true) {
                HttpStatusCode.Conflict to "User already has a booklist with this name"
            } else {
                HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
            }
        } catch (ex: Exception) {
            HttpStatusCode.BadRequest to "Error creating booklist: ${ex.message}"
        }
    }

    suspend fun addBookToBooklist(booklistBook: BooklistBook): Pair<HttpStatusCode, String> {
        return try {
            booklistRepository.addBookToBooklist(booklistBook.booklistId, booklistBook.isbn)
            HttpStatusCode.Created to "Book added to booklist successfully"
        } catch (ex: SQLException) {
            if (ex.message?.contains("unique constraint") == true) {
                HttpStatusCode.Conflict to "Book is already in this booklist"
            } else {
                HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
            }
        } catch (ex: SQLException) {
            handleSQLException(ex)
        } catch (ex: Exception) {
            HttpStatusCode.BadRequest to "Error adding book to booklist: ${ex.message}"
        }
    }

    suspend fun updateBooklist(booklistId: Int?, updatedBooklist: Booklist): Pair<HttpStatusCode, String> {
        if (booklistId == null) {
            return HttpStatusCode.BadRequest to "Booklist ID is required"
        }
        return try {
            val updated = booklistRepository.updateBooklist(booklistId, updatedBooklist)
            if (updated) {
                HttpStatusCode.OK to "Booklist updated successfully"
            } else {
                HttpStatusCode.NotFound to "Booklist not found"
            }
        } catch (ex: SQLException) {
            handleSQLException(ex)
        } catch (ex: Exception) {
            HttpStatusCode.BadRequest to "Error updating booklist: ${ex.message}"
        }
    }

    suspend fun removeBooklist(id: String?): Pair<HttpStatusCode, String> {
        if (id.isNullOrBlank()) return HttpStatusCode.BadRequest to "Booklist ID is required"
        return if (booklistRepository.removeBooklist(id.toInt())) {
            HttpStatusCode.OK to "Booklist deleted successfully"
        } else {
            HttpStatusCode.NotFound to "Booklist not found"
        }
    }

    suspend fun removeBookFromBooklist(isbn: String?, booklistId: String?): Pair<HttpStatusCode, String> {
        if (isbn.isNullOrBlank() || booklistId.isNullOrBlank()) {
            return HttpStatusCode.BadRequest to "Booklist ID and ISBN are required"
        }
        return if (booklistRepository.removeBookFromBooklist(booklistId.toInt(), isbn)) {
            HttpStatusCode.OK to "Book deleted from booklist successfully"
        } else {
            HttpStatusCode.NotFound to "Book not found in this booklist"
        }
    }

    private fun handleSQLException(ex: SQLException): Pair<HttpStatusCode, String>  {
        return if (ex.message?.contains("constraint") == true) {
            HttpStatusCode.Conflict to "Conflict with existing entry"
        } else {
            HttpStatusCode.InternalServerError to "Database error: ${ex.message}"
        }
    }
}