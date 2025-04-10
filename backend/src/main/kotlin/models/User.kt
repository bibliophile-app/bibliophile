package com.bibliophile.models

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: Int? = null,
    val username: String,
    val passwordHash: String
) 
