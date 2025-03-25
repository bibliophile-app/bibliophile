package com.bibliophile.db

import com.bibliophile.models.Booklist
import com.bibliophile.db.entities.BooklistDAO

fun daoToModel(dao: BooklistDAO) = Booklist(
    dao.id.value,
    dao.userId,
    dao.listName,
    dao.listDescription ?: "",
)