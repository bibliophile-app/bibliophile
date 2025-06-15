package com.bibliophile.utils

import io.ktor.http.*
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import com.bibliophile.models.*

/**
 * Função de extensão para registrar um usuário através do endpoint `/register`.
 */
suspend fun HttpClient.registerUser(
    email: String,
    username: String,
    password: String
): HttpResponse = post("/register") {
    header(HttpHeaders.ContentType, ContentType.Application.Json)
    setBody("""
        {
            "email": "$email",
            "username": "$username",
            "password": "$password"
        }
    """.trimIndent())
}

/**
 * Função de extensão para fazer login de um usuário através do endpoint `/login`.
 */
suspend fun HttpClient.loginUser(
    username: String,
    password: String
): HttpResponse = post("/login") {
    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
    setBody("""
        {
            "username": "$username",
            "password": "$password"
        }
    """.trimIndent())
}

/**
 * Função de extensão para criar e logar um usuário e retornar cookie
 */
suspend fun HttpClient.registerAndLoginUser(
    email: String,
    username: String, 
    password: String
): String {
    val sessionCookie = registerUser(email, username, password).setCookie().find { it.name == "USER_SESSION" }
    requireNotNull(sessionCookie) { "Login did not return a session cookie" }
    return "${sessionCookie.name}=${sessionCookie.value}"
}

/**
 * Função para fazer criar cookie de sessão manualmente
 */
fun createSessionCookie(session: UserSession): String {
    val serializer = io.ktor.serialization.kotlinx.json.DefaultJson.encodeToString(
        UserSession.serializer(), session
    )
    val encoded = java.net.URLEncoder.encode(serializer, "UTF-8")
    return "USER_SESSION=$encoded"
}

suspend fun HttpClient.addQuote(
    sessionCookie: String,
    content: String
): HttpResponse = this.post("/quotes") {
    header(HttpHeaders.ContentType, ContentType.Application.Json)
    header(HttpHeaders.Cookie, sessionCookie)
    setBody("""
        {
            "content": "$content"
        }
    """.trimIndent())
}

suspend fun HttpClient.editQuote(
    sessionCookie: String,
    quoteId: Int,
    content: String
): HttpResponse = this.put("/quotes/$quoteId") {
    header(HttpHeaders.ContentType, ContentType.Application.Json)
    header(HttpHeaders.Cookie, sessionCookie)
    setBody("""
        {
            "content": "$content"
        }
    """.trimIndent())
}

suspend fun HttpClient.addFollow(sessionCookie: String, followeeId: Int): HttpResponse =
    post("/followers") {
        header(HttpHeaders.ContentType, ContentType.Application.Json)
        header(HttpHeaders.Cookie, sessionCookie)
        setBody("""{"followeeId": $followeeId}""")
}

suspend fun HttpClient.deleteFollow(sessionCookie: String, followeeId: Int): HttpResponse =
    delete("/followers") {
        header(HttpHeaders.ContentType, ContentType.Application.Json)
        header(HttpHeaders.Cookie, sessionCookie)
        setBody("""{"followeeId": $followeeId}""")
}

suspend fun HttpClient.getUserIdByUsername(username: String): Int {
    val response = get("/users/$username")
    val body = response.bodyAsText()
    return Regex("\"id\"\\s*:\\s*(\\d+)").find(body)?.groupValues?.get(1)?.toInt()
        ?: error("User id not found in response: $body")
}