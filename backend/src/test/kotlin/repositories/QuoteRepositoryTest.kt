package com.bibliophile.repositories

import kotlin.test.*
import kotlinx.coroutines.runBlocking
import java.time.LocalDate

import com.bibliophile.models.QuoteRequest
import com.bibliophile.models.UserRequest

import com.bibliophile.utils.TestDatabaseFactory

class QuoteRepositoryTest {

    @BeforeTest
    fun setup() {
        TestDatabaseFactory.init()
    }

    @AfterTest
    fun teardown() {
        TestDatabaseFactory.reset()
    }

    @Test
    fun `test create quote`() = runBlocking {

        val user = UserRepository.add(UserRequest(email = "user@email.com", username = "user", password = "password"))
        val quoteRequest = QuoteRequest(
            content = "This is a test quote"
        )
        
        val quote = QuoteRepository.add(userId = user.id, request = quoteRequest)
        
        assertNotNull(quote)
        assertEquals("This is a test quote", quote.content)

    }

    @Test
    fun `test edit quote`() = runBlocking {

        val user = UserRepository.add(UserRequest(email = "user@email.com", username = "user", password = "password"))
        val quoteRequest = QuoteRequest(
            content = "This is a test quote"
        )

        val quote = QuoteRepository.add(userId = user.id, request = quoteRequest)

        val editRequest = QuoteRequest(
            content = "This is an edit quote"
        )
        val editResult = QuoteRepository.update(quote.id, user.id, editRequest)

        assertTrue(editResult)

        val editQuote = QuoteRepository.findById(quote.id)
        assertNotNull(editQuote)
        assertEquals("This is an edit quote", editQuote?.content)
    }

    @Test
    fun `test edit quote with wrong user ID returns false`() = runBlocking {
        val user1 = UserRepository.add(UserRequest(email = "user1@email.com", username = "user1", password = "password"))
        val user2 = UserRepository.add(UserRequest(email = "user2@email.com", username = "user2", password = "password"))

        val quoteRequest = QuoteRequest(
            content = "This is an edit quote wrong user"
        )

        val createdQuote = QuoteRepository.add(userId = user1.id, request = quoteRequest)

        val editResult = QuoteRepository.update(createdQuote.id, user2.id, quoteRequest)
        assertFalse(editResult)
    }

    @Test
    fun `test get quotes`() = runBlocking {

        val user = UserRepository.add(UserRequest(email = "user@email.com", username = "user", password = "password"))
        val quoteRequest1 = QuoteRequest(
            content = "This is a test quote1"
        )
        val quoteRequest2 = QuoteRequest(
            content = "This is a test quote2"
        )
        val quoteRequest3 = QuoteRequest(
            content = "This is a test quote3"
        )

        QuoteRepository.add(userId = user.id, request = quoteRequest1)
        QuoteRepository.add(userId = user.id, request = quoteRequest2)
        QuoteRepository.add(userId = user.id, request = quoteRequest3)

        val quotes = QuoteRepository.all()
        assertEquals(3, quotes.size)
        assertEquals("This is a test quote1", quotes[0].content)
        assertEquals("This is a test quote2", quotes[1].content)
        assertEquals("This is a test quote3", quotes[2].content)
    }



    @Test
    fun `test delete quote`() = runBlocking {

        val user = UserRepository.add(UserRequest(email = "user@email.com", username = "user", password = "password"))
        val quoteRequest = QuoteRequest(
            content = "This quote will be deleted"
        )

        val createdQuote = QuoteRepository.add(userId = user.id, request = quoteRequest)

        val deleteResult = QuoteRepository.delete(createdQuote.id, user.id)
        assertTrue(deleteResult)

        val deletedQuote = QuoteRepository.findById(createdQuote.id)
        assertNull(deletedQuote)
    }

    @Test
    fun `test delete quote with invalid ID returns false`() = runBlocking {
        val user = UserRepository.add(UserRequest(email = "user@email.com", username = "user", password = "password"))

        val deleteResult = QuoteRepository.delete(-1, user.id)
        assertFalse(deleteResult)
    }

    @Test
    fun `test delete quote with wrong user ID returns false`() = runBlocking {
        val user1 = UserRepository.add(UserRequest(email = "user1@email.com", username = "user1", password = "password"))
        val user2 = UserRepository.add(UserRequest(email = "user2@email.com", username = "user2", password = "password"))

        val quoteRequest = QuoteRequest(
            content = "This is an edit quote wrong user"
        )

        val createdQuote = QuoteRepository.add(user1.id, quoteRequest)

        val deleteResult = QuoteRepository.delete(createdQuote.id, user2.id)
        assertFalse(deleteResult)
    }
}