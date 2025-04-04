package com.bibliophile.db

import com.bibliophile.models.User
import com.bibliophile.models.Booklist
import com.bibliophile.db.entities.UserDAO
import com.bibliophile.db.entities.BooklistDAO

fun daoToModel(dao: BooklistDAO) = Booklist(
    dao.id.value,
    dao.userId,
    dao.listName,
    dao.listDescription ?: "",
)

fun daoToModel(dao: UserDAO) = User(
    id = dao.id.value,
    username = dao.username,
    passwordHash = dao.passwordHash
)
