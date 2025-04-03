package com.bibliophile.models

import kotlinx.serialization.Serializable

@Serializable
data class Booklist(
    val id: Int? = null,
    val userId: Int,
    val listName: String,
    val listDescription: String?,
)

@Serializable
data class BooklistWithBooks(
    val id: Int,
    val userId: Int,
    val listName: String,
    val listDescription: String?,
    val books: List<String>
)

@Serializable
data class BooklistBook(
    val booklistId: Int,
    val isbn: String,
)