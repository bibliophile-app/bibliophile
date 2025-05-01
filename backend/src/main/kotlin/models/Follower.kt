package com.bibliophile.models

import kotlinx.serialization.Serializable

@Serializable
data class Follower(
    val id: Int? = null,
    val following_user_id: Int,
    val followed_user_id: Int
) 

@Serializable
data class FollowerRequest(
    val following_user_id: Int,
    val followed_user_id: Int
)
