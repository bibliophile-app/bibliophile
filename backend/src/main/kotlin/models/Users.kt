package com.bibliophile.models

import org.jetbrains.exposed.dao.id.IntIdTable

object Users : IntIdTable() {
    val name = varchar("name", 50)
    val email = varchar("email", 100).uniqueIndex()
}
