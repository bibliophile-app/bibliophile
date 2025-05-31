package com.bibliophile.routes

import kotlin.test.*
import io.ktor.http.*
import io.ktor.client.*
import io.ktor.server.auth.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.server.testing.*

import com.bibliophile.models.*
import com.bibliophile.utils.*
import com.bibliophile.repositories.UserRepository

class UserRoutesTest {

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
        install(Authentication) {
            session<UserSession>("auth-session") {
                validate { session ->
                    if (session.userId != null) session else null
                }
                challenge {
                    call.respond(HttpStatusCode.Unauthorized, null)
                }
            }
        }
        routing {
            authRoutes()
            userRoutes()
        }
    }

    @Test
    fun `test get all users`() = testApplication {
        application { setupTestModule() }

        // Create some test users first
        client.registerUser("user1@test.com", "user1", "password123")
        client.registerUser("user2@test.com", "user2", "password123")

        val response = client.get("/users")

        assertEquals(HttpStatusCode.OK, response.status)
        val responseText = response.bodyAsText()
        assertTrue(responseText.contains("user1"))
        assertTrue(responseText.contains("user2"))
    }

    @Test
    fun `test get user profile by ID`() = testApplication {
        application { setupTestModule() }

        val registerResponse = client.registerUser("test@example.com", "testuser", "password123")
        val userId = registerResponse.bodyAsText().extractUserId()

        val response = client.get("/users/$userId")

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("testuser"))
    }

    @Test
    fun `test get user profile by username`() = testApplication {
        application { setupTestModule() }

        client.registerUser("test@example.com", "testuser", "password123")

        val response = client.get("/users/testuser")

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("testuser"))
    }

    @Test
    fun `test get non-existent user`() = testApplication {
        application { setupTestModule() }

        val response = client.get("/users/999")

        assertEquals(HttpStatusCode.NotFound, response.status)
        assertTrue(response.bodyAsText().contains("User not found"))
    }

    @Test
    fun `test update user profile`() = testApplication {
        application { setupTestModule() }

        val registerResponse = client.registerUser("test@example.com", "testuser", "password123")
        val userId = registerResponse.bodyAsText().extractUserId()
        val sessionCookie = registerResponse.setCookie().find { it.name == "USER_SESSION" }
            ?.let { "${it.name}=${it.value}" }
            ?: error("Session cookie not found")

        val updateResponse = client.put("/users/$userId") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            header(HttpHeaders.Cookie, sessionCookie)
            setBody("""
                {
                    "email": "updated@example.com",
                    "username": "updateduser",
                    "password": "password123"
                }
            """.trimIndent())
        }

        assertEquals(HttpStatusCode.OK, updateResponse.status)
        assertTrue(updateResponse.bodyAsText().contains("User updated successfully"))

        val getResponse = client.get("/users/$userId")
        assertEquals(HttpStatusCode.OK, getResponse.status)
        assertTrue(getResponse.bodyAsText().contains("updateduser"))
    }
    
    @Test
    fun `test update other user's profile`() = testApplication {
        application { setupTestModule() }

        // Create and login as first user
        val sessionCookie = client.registerAndLoginUser("test@example.com", "testuser", "password123")

        // Create second user
        val otherUserResponse = client.registerUser("other@example.com", "otheruser", "password123")
        val otherUserId = otherUserResponse.bodyAsText().extractUserId()

        // Try to update other user's profile
        val response = client.put("/users/$otherUserId") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            header(HttpHeaders.Cookie, sessionCookie)
            setBody("""
                {
                    "email": "hacked@example.com",
                    "username": "hackeduser"
                }
            """.trimIndent())
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
        assertTrue(response.bodyAsText().contains("Can only update own profile"))
    }

    @Test
    fun `test update nonexistent user profile`() = testApplication {
        application { setupTestModule() }
        
        val registerResponse = client.registerUser("test@example.com", "testuser", "password123")
        val userId = registerResponse.bodyAsText().extractUserId()
        val sessionCookie = registerResponse.setCookie().find { it.name == "USER_SESSION" }
            ?.let { "${it.name}=${it.value}" }
            ?: error("Session cookie not found")

        // Delete user first
        UserRepository.delete(userId)
        
        val response = client.put("/users/$userId") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            header(HttpHeaders.Cookie, sessionCookie)
            setBody("""
                {
                    "email": "updated@example.com",
                    "username": "updateduser",
                    "password": "password123"
                }
            """.trimIndent())
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
        assertTrue(response.bodyAsText().contains("User not found"))
    }
    
    @Test
    fun `test delete user`() = testApplication {
        application { setupTestModule() }
        
        val registerResponse = client.registerUser("test@example.com", "testuser", "password123")
        val userId = registerResponse.bodyAsText().extractUserId()
        val sessionCookie = registerResponse.setCookie().find { it.name == "USER_SESSION" }
            ?.let { "${it.name}=${it.value}" }
            ?: error("Session cookie not found")

        val response = client.delete("/users/$userId") {
            header(HttpHeaders.Cookie, sessionCookie)
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("User deleted successfully"))
    }

    @Test
    fun `test delete other user's account`() = testApplication {
        application { setupTestModule() }

        // Create and login as first user
        val sessionCookie = client.registerAndLoginUser("test@example.com", "testuser", "password123")

        // Create second user
        val otherUserResponse = client.registerUser("other@example.com", "otheruser", "password123")
        val otherUserId = otherUserResponse.bodyAsText().extractUserId()

        // Try to delete other user's account
        val response = client.delete("/users/$otherUserId") {
            header(HttpHeaders.Cookie, sessionCookie)
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
        assertTrue(response.bodyAsText().contains("Can only delete own account"))
    }

    @Test
    fun `test delete nonexistent user`() = testApplication {
        application { setupTestModule() }
        
        val registerResponse = client.registerUser("test@example.com", "testuser", "password123")
        val userId = registerResponse.bodyAsText().extractUserId()
        val sessionCookie = registerResponse.setCookie().find { it.name == "USER_SESSION" }
            ?.let { "${it.name}=${it.value}" }
            ?: error("Session cookie not found")
        
        // Delete user first through repository
        UserRepository.delete(userId)

        val response = client.delete("/users/$userId") {
            header(HttpHeaders.Cookie, sessionCookie)
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
        assertTrue(response.bodyAsText().contains("User not found"))
    }

    private fun String.extractUserId(): Int {
        val regex = """User ID:\s*(\d+)""".toRegex()
        val match = regex.find(this)
        return match?.groupValues?.get(1)?.toInt() ?: error("User ID not found in response")
    }
}