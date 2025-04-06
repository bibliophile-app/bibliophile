package com.bibliophile.models

import kotlinx.serialization.Serializable

@Serializable
data class Review(
    val id: Int? = null,
    val isbn: String,
    val userId: Int,
    val content: String,
    val rate: Int,
    val favorite: Boolean
) 