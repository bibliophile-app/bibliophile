package com.bibliophile.db

import com.bibliophile.models.User
import com.bibliophile.db.entities.UserDAO

fun daoToModel(dao: UserDAO) = User(
    id = dao.id.value,
    username = dao.username,
    passwordHash = dao.passwordHash
)
