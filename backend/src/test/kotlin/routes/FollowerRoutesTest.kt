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

class FollowerRoutesTest {

    @BeforeTest
    fun setup() {
        TestDatabaseFactory.init()
    }

    @AfterTest
    fun teardown() {
        TestDatabaseFactory.reset()
    }

    private fun Application.setupTestModule() {
        install(ContentNegotiation) { json() }
        install(Sessions) {
            cookie<UserSession>("USER_SESSION") {
                cookie.path = "/"
                cookie.httpOnly = true
            }
        }
        install(Authentication) {
            session<UserSession>("auth-session") {
                validate { session -> if (session.userId != null) session else null }
                challenge { call.respond(HttpStatusCode.Unauthorized, null) }
            }
        }
        routing {
            authRoutes()
            followerRoutes()
        }
    }

    @Test
    fun `test add follow`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")
        client.registerAndLoginUser("user2@email.com", "user2", "password")

        val user2Id = client.getUserIdByUsername("user2")

        val response = client.addFollow(sessionCookie, user2Id)

        assertEquals(HttpStatusCode.Created, response.status)
        assertTrue(response.bodyAsText().contains("Follow created successfully"))
    }

    @Test
    fun `test delete follow`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")
        client.registerAndLoginUser("user2@email.com", "user2", "password")

        val user2Id = client.getUserIdByUsername("user2")
        client.addFollow(sessionCookie, user2Id)

        val response = client.deleteFollow(sessionCookie, user2Id)

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("Follow deleted successfully"))
    }

    @Test
    fun `test get followers and following`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")
        client.registerAndLoginUser("user2@email.com", "user2", "password")

        val user2Id = client.getUserIdByUsername("user2")
        client.addFollow(sessionCookie, user2Id)

        val followersResponse = client.get("/followers/${user2Id}/followers")

        assertEquals(HttpStatusCode.OK, followersResponse.status)
        assertTrue(followersResponse.bodyAsText().contains("\"followerId\""))

        val followingResponse = client.get("/followers/${1}/following")

        assertEquals(HttpStatusCode.OK, followingResponse.status)
        assertTrue(followingResponse.bodyAsText().contains("\"followeeId\""))
    }

    @Test
    fun `test check is following`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")
        client.registerAndLoginUser("user2@email.com", "user2", "password")

        val followerId = client.getUserIdByUsername("user")
        val user2Id = client.getUserIdByUsername("user2")
        client.addFollow(sessionCookie, user2Id)

        val checkResponse = client.get("/followers/check?followerId=$followerId&followeeId=$user2Id")

        assertEquals(HttpStatusCode.OK, checkResponse.status)
        assertTrue(checkResponse.bodyAsText().contains("\"isFollowing\":true"))
    }
}