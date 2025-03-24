package com.bibliophile.models

import kotlinx.serialization.Serializable

@Serializable
data class Booklist(
    val id: Int? = null,
    val userId: Int,
    val name: String,
    val description: String?,
)

@Serializable
data class BooklistWithBooks(
    val id: Int,
    val userId: Int,
    val name: String,
    val description: String?,
    val books: List<String>
)