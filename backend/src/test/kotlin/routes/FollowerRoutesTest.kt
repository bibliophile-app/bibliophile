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

    private suspend fun HttpClient.addFollow(sessionCookie: String, followeeId: Int): HttpResponse =
        post("/followers") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            header(HttpHeaders.Cookie, sessionCookie)
            setBody("""{"followeeId": $followeeId}""")
    }

    private suspend fun HttpClient.deleteFollow(sessionCookie: String, followeeId: Int): HttpResponse =
        delete("/followers") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            header(HttpHeaders.Cookie, sessionCookie)
            setBody("""{"followeeId": $followeeId}""")
    }

    @Test
    fun `test add follow`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val registerUser2Response = client.registerUser("user2@email.com", "user2", "password")
        val user2Id = registerUser2Response.bodyAsText().extractUserId()


        val response = client.addFollow(sessionCookie, user2Id)

        assertEquals(HttpStatusCode.Created, response.status)
        assertTrue(response.bodyAsText().contains("Follow created successfully"))
    }

    @Test
    fun `test duplicate follow`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val registerUser2Response = client.registerUser("user2@email.com", "user2", "password")
        val user2Id = registerUser2Response.bodyAsText().extractUserId()

        client.addFollow(sessionCookie, user2Id)
        val response = client.addFollow(sessionCookie, user2Id)

        assertEquals(HttpStatusCode.Conflict, response.status)
        assertTrue(response.bodyAsText().contains("Already following this user"))
    }

    @Test
    fun `test follow yourself`() = testApplication {
        application { setupTestModule() }

        val registerUser1Response = client.registerUser("user1@email.com", "user1", "password")
        val user1Id = registerUser1Response.bodyAsText().extractUserId()
        val loginUser1Response = client.loginUser("user1", "password")
        val sessionCookie = loginUser1Response.setCookie().find { it.name == "USER_SESSION" }
        requireNotNull(sessionCookie) { "Login did not return a session cookie" }
        val sessionCookieString = "${sessionCookie.name}=${sessionCookie.value}"

        val response = client.addFollow(sessionCookieString, user1Id)

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertTrue(response.bodyAsText().contains("User cannot follow themselves"))
    }

    @Test
    fun `test delete follow`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val registerUser2Response = client.registerUser("user2@email.com", "user2", "password")
        val user2Id = registerUser2Response.bodyAsText().extractUserId()

        client.addFollow(sessionCookie, user2Id)

        val response = client.deleteFollow(sessionCookie, user2Id)

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("Unfollowed successfully"))
    }

    @Test
    fun `test delete follow that does not exist`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val registerUser2Response = client.registerUser("user2@email.com", "user2", "password")
        val user2Id = registerUser2Response.bodyAsText().extractUserId()

        val response = client.deleteFollow(sessionCookie, user2Id)

        assertEquals(HttpStatusCode.NotFound, response.status)
        assertTrue(response.bodyAsText().contains("Follow not found"))
    }

    @Test
    fun `test get all follows`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val registerUser2Response = client.registerUser("user2@email.com", "user2", "password")
        val user2Id = registerUser2Response.bodyAsText().extractUserId()

        val registerUser3Response = client.registerUser("user3@email.com", "user3", "password")
        val user3Id = registerUser3Response.bodyAsText().extractUserId()


        client.addFollow(sessionCookie, user2Id)
        client.addFollow(sessionCookie, user3Id)

        val followsResponse = client.get("/followers")

        assertEquals(HttpStatusCode.OK, followsResponse.status)

        val responseBody = followsResponse.bodyAsText()
        val numberOfFollows = Regex("""\{[^\}]*\}""").findAll(responseBody).count()
        assertEquals(2, numberOfFollows, "Should return exactly 2 follows")
    }

    @Test 
    fun `test get followers`() = testApplication {
        application { setupTestModule() }

        val registerUser1Response = client.registerUser("user1@email.com", "user1", "password")
        val user1Id = registerUser1Response.bodyAsText().extractUserId()
        val loginUser1Response = client.loginUser("user1", "password")
        val sessionCookie = loginUser1Response.setCookie().find { it.name == "USER_SESSION" }
        requireNotNull(sessionCookie) { "Login did not return a session cookie" }
        val sessionCookieString = "${sessionCookie.name}=${sessionCookie.value}"


        val registerUser2Response = client.registerUser("user2@email.com", "user2", "password")
        val user2Id = registerUser2Response.bodyAsText().extractUserId()

        client.addFollow(sessionCookieString, user2Id)

        val followersResponse = client.get("/followers/${user2Id}/followers")

        assertEquals(HttpStatusCode.OK, followersResponse.status)

        assertTrue(followersResponse.bodyAsText().contains("\"followerId\":${user1Id}"))
        assertTrue(followersResponse.bodyAsText().contains("\"followeeId\":${user2Id}"))

    }

    @Test 
    fun `test get following`() = testApplication {
        application { setupTestModule() }

        val registerUser1Response = client.registerUser("user1@email.com", "user1", "password")
        val user1Id = registerUser1Response.bodyAsText().extractUserId()
        val loginUser1Response = client.loginUser("user1", "password")
        val sessionCookie = loginUser1Response.setCookie().find { it.name == "USER_SESSION" }
        requireNotNull(sessionCookie) { "Login did not return a session cookie" }
        val sessionCookieString = "${sessionCookie.name}=${sessionCookie.value}"


        val registerUser2Response = client.registerUser("user2@email.com", "user2", "password")
        val user2Id = registerUser2Response.bodyAsText().extractUserId()

        client.addFollow(sessionCookieString, user2Id)

        val followersResponse = client.get("/followers/${user1Id}/following")
        assertEquals(HttpStatusCode.OK, followersResponse.status)
        
        assertTrue(followersResponse.bodyAsText().contains("\"followerId\":${user1Id}"))
        assertTrue(followersResponse.bodyAsText().contains("\"followeeId\":${user2Id}"))

    }

    @Test
    fun `test check is following`() = testApplication {
        application { setupTestModule() }

        val registerUser1Response = client.registerUser("user1@email.com", "user1", "password")
        val user1Id = registerUser1Response.bodyAsText().extractUserId()
        val loginUser1Response = client.loginUser("user1", "password")
        val sessionCookie = loginUser1Response.setCookie().find { it.name == "USER_SESSION" }
        requireNotNull(sessionCookie) { "Login did not return a session cookie" }
        val sessionCookieString = "${sessionCookie.name}=${sessionCookie.value}"

        val registerUser2Response = client.registerUser("user2@email.com", "user2", "password")
        val user2Id = registerUser2Response.bodyAsText().extractUserId()

        client.addFollow(sessionCookieString, user2Id)

        val checkResponse = client.get("/followers/check?followerId=$user1Id&followeeId=$user2Id")

        assertEquals(HttpStatusCode.OK, checkResponse.status)
        assertTrue(checkResponse.bodyAsText().contains("\"isFollowing\":true"))
    }

    @Test
    fun `test check is following null`() = testApplication {
        application { setupTestModule() }

        val checkResponse = client.get("/followers/check")

        assertEquals(HttpStatusCode.BadRequest, checkResponse.status)
        assertTrue(checkResponse.bodyAsText().contains("\"message\":\"Both user IDs are required\""))
        
    }

}