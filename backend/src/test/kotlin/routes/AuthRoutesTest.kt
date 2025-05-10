package com.bibliophile.routes

import kotlin.test.*
import io.ktor.http.*
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.server.testing.*


import com.bibliophile.models.UserSession
import com.bibliophile.db.TestDatabaseFactory

class AuthRoutesTest {

    @BeforeTest
    fun setup() {
        TestDatabaseFactory.init()
    }

    @AfterTest
    fun teardown() {
        TestDatabaseFactory.reset()
    }

    private fun Application.setupTestModule() {
        install(ContentNegotiation) {
            json()
        }
        install(Sessions) {
            cookie<UserSession>("USER_SESSION") {
                cookie.path = "/"
                cookie.httpOnly = true
            }
        }
        routing {
            authRoutes()
        }
    }

    private suspend fun HttpClient.registerUser(
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

    private suspend fun HttpClient.loginUser(
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

    @Test
    fun `test register with valid data`() = testApplication {
        application { setupTestModule() }
       
        val response = client.registerUser(
            email = "test@example.com",
            username = "testuser",
            password = "password123"
        )

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("Registered"))
    }

    @Test
    fun `test register with existing username`() = testApplication {
        application { setupTestModule() }
       
        client.registerUser("test@example.com", "existinguser", "password123")
        val response = client.registerUser("another@example.com", "existinguser", "password123")

        assertEquals(HttpStatusCode.Conflict, response.status)
        assertEquals("Username already exists", response.bodyAsText())
    }

    @Test
    fun `test login with valid credentials`() = testApplication {
        application { setupTestModule() }
        
        client.registerUser("test@example.com", "testuser", "password123")
        val response = client.loginUser("testuser", "password123")

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("Logged in"))
    }

    @Test
    fun `test login with invalid credentials`() = testApplication {
        application { setupTestModule() }
       
        val response = client.loginUser("nonexistentuser", "wrongpassword")

        assertEquals(HttpStatusCode.Unauthorized, response.status)
        assertEquals("Invalid credentials", response.bodyAsText())
    }


    @Test
    fun `test logout`() = testApplication {
        application { setupTestModule() }
        
        val response = client.get("/logout")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("Logged out"))
    }

    @Test
    fun `test me endpoint when authenticated`() = testApplication {
        application { setupTestModule() }
       
        client.registerUser("test@example.com", "testuser", "password123")
        val loginResponse = client.loginUser("testuser", "password123")

        val sessionCookie = loginResponse.setCookie().find { it.name == "USER_SESSION" }
        requireNotNull(sessionCookie) { "Login did not return a session cookie" }

        val meResponse = client.get("/me") {
            header(HttpHeaders.Cookie, "${sessionCookie.name}=${sessionCookie.value}")
        }

        assertEquals(HttpStatusCode.OK, meResponse.status)
        assertTrue(meResponse.bodyAsText().contains("testuser"))
    }

    @Test
    fun `test me endpoint when not authenticated`() = testApplication {
        application { setupTestModule() }
       
        val response = client.get("/me")
        assertEquals(HttpStatusCode.Unauthorized, response.status)
        assertTrue(response.bodyAsText().contains("Not authenticated"))
    }
}