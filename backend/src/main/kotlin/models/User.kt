package com.bibliophile.models

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: Int,
    val email: String,
    val username: String,
    val passwordHash: String
) 

@Serializable
data class UserSession(val userId: Int?)


@Serializable
data class UserRequest(
    val email: String,
    val username: String,
    val password: String
) 

@Serializable
data class LoginRequest(
    val username: String, 
    val password: String
)

@Serializable
data class UserProfileResponse(
    val id: Int,
    val username: String,
    val quotes: List<Quote>,
)
