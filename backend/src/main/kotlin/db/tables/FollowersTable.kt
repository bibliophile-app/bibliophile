package com.bibliophile.db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object FollowersTable : IntIdTable("followers") {

    val following_user_id = integer("following_user_id")
    val followed_user_id = integer("followed_user_id")
}