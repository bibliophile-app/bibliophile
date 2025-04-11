package com.bibliophile.models

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: Int? = null,
    val username: String,
    val passwordHash: String
) 

@Serializable
data class UserSession(val userId: Int?)

@Serializable
data class UserProfileResponse(
    val id: Int,
    val username: String,
    val booklists: List<Booklist>,
    val quotes: List<Quote>,
    val reviews: List<Review>
)
