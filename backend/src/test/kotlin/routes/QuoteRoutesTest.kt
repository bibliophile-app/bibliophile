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

class QuoteRoutesTest {

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
            quoteRoutes()
        }
    }
    private suspend fun HttpClient.addQuote(
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

    private suspend fun HttpClient.editQuote(
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

    @Test
    fun `test create quote`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")
        val response = client.addQuote(
            sessionCookie,
            content = "This is a test quote"
        )

        assertEquals(HttpStatusCode.Created, response.status)
        assertTrue(response.bodyAsText().contains("Quote created successfully"))
    }

    @Test
    fun `test create quote without authentication`() = testApplication {
        application { setupTestModule() }

        val response = client.addQuote(
            sessionCookie = "",
            content = "This is a test quote without auth"
        )

        assertEquals(HttpStatusCode.Unauthorized, response.status)
    }

    @Test
    fun `test edit quote`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val createResponse = client.addQuote(
            sessionCookie,
            content = "This is a quote to edit"
        )

        val quoteId = createResponse.bodyAsText().extractQuoteId()

        val editResponse = client.editQuote(
            sessionCookie,
            quoteId,
            content = "This is the edited quote"
        )

        assertEquals(HttpStatusCode.OK, editResponse.status)
        assertTrue(editResponse.bodyAsText().contains("Quote updated successfully"))
    }

    @Test
    fun `test edit quote by non-owner returns forbidden`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val createResponse = client.addQuote(
            sessionCookie,
            content = "This is a quote to edit"
        )

        val quoteId = createResponse.bodyAsText().extractQuoteId()

        val otherCookie = client.registerAndLoginUser("other@email.com", "other", "password")
        val editResponse = client.editQuote(
            otherCookie,
            quoteId,
            content = "This is an unauthorized edit"
        )

        assertEquals(HttpStatusCode.Forbidden, editResponse.status)
        assertTrue(editResponse.bodyAsText().contains("You don't own this quote"))
    }

    @Test
    fun `test get all quotes`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")
        client.addQuote(
            sessionCookie,
            content = "First test quote"
        )
        client.addQuote(
            sessionCookie,
            content = "Second test quote"
        )

        val response = client.get("/quotes") {
            header(HttpHeaders.Cookie, sessionCookie)
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val quotes = response.bodyAsText()
        assertTrue(quotes.contains("First test quote"))
        assertTrue(quotes.contains("Second test quote"))
    }

    @Test
    fun `test get quote by id`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val createResponse = client.addQuote(
            sessionCookie,
            content = "This is a quote to get"
        )

        val quoteId = createResponse.bodyAsText().extractQuoteId()

        val response = client.get("/quotes/$quoteId") {
            header(HttpHeaders.Cookie, sessionCookie)
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("This is a quote to get"))
    }

    @Test
    fun `test get quote by id not found`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val response = client.get("/quotes/9999") {
            header(HttpHeaders.Cookie, sessionCookie)
        }
        assertEquals(HttpStatusCode.NotFound, response.status)
        assertTrue(response.bodyAsText().contains("Quote not found"))
    }

    @Test
    fun `test delete quote`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val createResponse = client.addQuote(
            sessionCookie,
            content = "This is a quote to delete"
        )

        val quoteId = createResponse.bodyAsText().extractQuoteId()

        val deleteResponse = client.delete("/quotes/$quoteId") {
            header(HttpHeaders.Cookie, sessionCookie)
        }

        assertEquals(HttpStatusCode.OK, deleteResponse.status)
        assertTrue(deleteResponse.bodyAsText().contains("Quote deleted successfully"))
    }

    @Test
    fun `test delete quote by non-owner returns forbidden`() = testApplication {
        application { setupTestModule() }

        val sessionCookie = client.registerAndLoginUser("user@email.com", "user", "password")

        val createResponse = client.addQuote(
            sessionCookie,
            content = "This is a quote to delete"
        )

        val quoteId = createResponse.bodyAsText().extractQuoteId()

        val otherCookie = client.registerAndLoginUser("other@email.com", "other", "password")
        val deleteResponse = client.delete("/quotes/$quoteId") {
            header(HttpHeaders.Cookie, otherCookie)
        }

        assertEquals(HttpStatusCode.Forbidden, deleteResponse.status)
        assertTrue(deleteResponse.bodyAsText().contains("You don't own this quote"))
    }

    private fun String.extractQuoteId(): Int {
        val regex = """Quote ID:\s*(\d+)""".toRegex()
        val match = regex.find(this)
        return match?.groupValues?.get(1)?.toInt() ?: error("Quote ID not found in response")
    }

}