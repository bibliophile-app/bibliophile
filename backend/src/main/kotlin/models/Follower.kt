package com.bibliophile.models

import kotlinx.serialization.Serializable

@Serializable
data class Follower(
    val id: Int? = null,
    val followerId: Int,
    val followeeId: Int
) 

@Serializable
data class FollowerRequest(
    val followerId: Int,
    val followeeId: Int
)
