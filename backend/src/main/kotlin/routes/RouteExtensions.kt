package com.bibliophile.routes

import io.ktor.http.*
import java.sql.SQLException
import io.ktor.server.application.*
import io.ktor.server.response.*

suspend fun ApplicationCall.getParam(param: String): String? {
    val paramValue = parameters[param]
    return if (paramValue.isNullOrBlank()) {
        respond(HttpStatusCode.BadRequest, mapOf("message" to "Missing '$param' parameter"))
        null
    } else {
        paramValue
    }
}

suspend fun ApplicationCall.getIntParam(param: String = "id"): Int? {
    val paramValue = parameters[param]?.toIntOrNull()
    if (paramValue == null) {
        respond(HttpStatusCode.BadRequest, mapOf("message" to "Invalid or missing '$param' parameter"))
    }
    return paramValue
}

suspend fun ApplicationCall.respondServerError(message: String) {
    respond(HttpStatusCode.InternalServerError, mapOf("message" to message))
}

suspend fun ApplicationCall.respondSqlException(
    ex: Throwable,
    customCheck: (SQLException) -> Boolean = { false }
) {
    when (ex) {
        is SQLException -> {
            val message = when {
                customCheck(ex) -> "Database violantion"
                ex.message?.contains("constraint", ignoreCase = true) == true -> "Database constraint violation"
                else -> "Database error: ${ex.message}"
            }
            respond(HttpStatusCode.Conflict, mapOf("message" to message))
        }
        else -> {
            respond(HttpStatusCode.BadRequest, mapOf("message" to "Unexpected error: ${ex.message}"))
        }
    }
}