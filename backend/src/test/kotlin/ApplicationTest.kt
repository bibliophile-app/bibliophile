package com.bibliophile

import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.Test
import kotlin.test.assertEquals

import com.bibliophile.db.TestDatabaseFactory

class ApplicationTest {

    @Test
    fun `test root endpoint`() = testApplication {
        application {
            module()
        }
        client.get("/").apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }

    @Test
    fun `test flyway migration alone`() {
        TestDatabaseFactory.init()
    }

}
