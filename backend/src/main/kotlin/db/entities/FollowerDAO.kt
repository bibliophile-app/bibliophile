package com.bibliophile.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import com.bibliophile.db.tables.FollowersTable

class FollowerDAO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<FollowerDAO>(FollowersTable)

    var following_user_id by FollowersTable.following_user_id
    var followed_user_id by FollowersTable.followed_user_id
}