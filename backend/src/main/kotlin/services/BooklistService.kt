package com.bibliophile.services

import com.bibliophile.models.Booklist
import com.bibliophile.repositories.BooklistRepository
import io.ktor.http.*

class BooklistService() {

    private val booklistRepository = BooklistRepository() 

    suspend fun getAllBooklists(): List<Booklist> {
        return booklistRepository.allBooklists()
    }

    suspend fun getBooklistByName(name: String?): Pair<HttpStatusCode, Any> {
        if (name.isNullOrBlank()) {
            return HttpStatusCode.BadRequest to "Booklist name is required"
        }
        val booklist = booklistRepository.booklistByName(name)
        return if (booklist != null) {
            HttpStatusCode.OK to booklist
        } else {
            HttpStatusCode.NotFound to "Booklist not found"
        }
    }

    suspend fun getBooklistWithBooks(name: String?): Pair<HttpStatusCode, Any> {
        if (name.isNullOrBlank()) {
            return HttpStatusCode.BadRequest to "Name required"
        }
        val booklist = booklistRepository.booklistWithBooks(name)
        return if (booklist != null) {
            HttpStatusCode.OK to booklist
        } else {
            HttpStatusCode.NotFound to "Booklist not found"
        }
    }

    suspend fun addBooklist(booklist: Booklist): HttpStatusCode {
        return try {
            booklistRepository.addBooklist(booklist)
            HttpStatusCode.Created
        } catch (ex: Exception) {
            HttpStatusCode.BadRequest
        }
    }

    suspend fun removeBooklist(name: String?): HttpStatusCode {
        if (name.isNullOrBlank()) {
            return HttpStatusCode.BadRequest
        }
        return if (booklistRepository.removeBooklist(name)) {
            HttpStatusCode.NoContent
        } else {
            HttpStatusCode.NotFound
        }
    }
}
