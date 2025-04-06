package com.bibliophile.models

import kotlinx.serialization.Serializable

@Serializable
data class Quote(
    val id: Int? = null,
    val userId: Int,
    val content: String
) 