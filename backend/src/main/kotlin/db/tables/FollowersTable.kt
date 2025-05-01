package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object FollowersTable : IntIdTable("followers") {

    val followingUser = reference(
        name = "following_user_id",
        foreign = UsersTable,
        onDelete = ReferenceOption.CASCADE
    )

    val followedUser = reference(
        name = "followed_user_id",
        foreign = UsersTable,
        onDelete = ReferenceOption.CASCADE
    )
}