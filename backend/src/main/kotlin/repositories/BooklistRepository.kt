package com.bibliophile.repositories

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

import com.bibliophile.db.daoToModel
import com.bibliophile.models.Booklist
import com.bibliophile.db.entities.BooklistDAO
import com.bibliophile.db.tables.BooklistTable
import com.bibliophile.db.suspendTransaction

class BooklistRepository {

    suspend fun allBooklists(): List<Booklist> = suspendTransaction {
        BooklistDAO.all().map(::daoToModel)
    }

    suspend fun booklistByName(name: String): Booklist?  = suspendTransaction {
        BooklistDAO
            .find { (BooklistTable.name eq name) }
            .limit(1)
            .map(::daoToModel)
            .firstOrNull()
    }
    
    suspend fun addBooklist(booklist: Booklist): Unit = suspendTransaction {
        BooklistDAO.new {
            userId = booklist.userId
            name = booklist.name
            description = booklist.description
        }
    }    

    suspend fun removeBooklist(name: String): Boolean = suspendTransaction {
        val rowsDeleted = BooklistTable.deleteWhere {
            BooklistTable.name eq name
        }
        rowsDeleted == 1
    }

}