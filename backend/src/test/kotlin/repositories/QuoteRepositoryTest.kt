package com.bibliophile.repositories

import kotlin.test.*
import kotlinx.coroutines.runBlocking
import java.time.LocalDate

import com.bibliophile.models.QuoteRequest
import com.bibliophile.utils.TestDatabaseFactory

class QuoteRepositoryTest {

    private val userRepository = UserRepository()
    private val quoteRepository = QuoteRepository()

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

        val user = userRepository.create("user@email.com", "user", "password")
        val quoteRequest = QuoteRequest(
            content = "This is a test quote"
        )
        
        val quote = quoteRepository.addQuote(userId = user.id, quote = quoteRequest)
        
        assertNotNull(quote)
        assertEquals("This is a test quote", quote.content)

    }

    @Test
    fun `test edit quote`() = runBlocking {

        val user = userRepository.create("user@email.com", "user", "password")
        val quoteRequest = QuoteRequest(
            content = "This is a test quote"
        )

        val quote = quoteRepository.addQuote(userId = user.id, quote = quoteRequest)

        val editRequest = QuoteRequest(
            content = "This is an edit quote"
        )
        val editResult = quoteRepository.editQuote(quote.id, user.id, editRequest)

        assertTrue(editResult)

        val editQuote = quoteRepository.quote(quote.id)
        assertNotNull(editQuote)
        assertEquals("This is an edit quote", editQuote?.content)
    }

    @Test
    fun `test edit quote with wrong user ID returns false`() = runBlocking {
        val user1 = userRepository.create("user1@email.com", "user1", "password")
        val user2 = userRepository.create("user2@email.com", "user2", "password")

        val quoteRequest = QuoteRequest(
            content = "This is an edit quote wrong user"
        )

        val createdQuote = quoteRepository.addQuote(userId = user1.id, quote = quoteRequest)

        val editResult = quoteRepository.editQuote(createdQuote.id, user2.id, quoteRequest)
        assertFalse(editResult)
    }

    @Test
    fun `test get quotes`() = runBlocking {
        
        val user = userRepository.create("user@email.com", "user", "password")
        val quoteRequest1 = QuoteRequest(
            content = "This is a test quote1"
        )
        val quoteRequest2 = QuoteRequest(
            content = "This is a test quote2"
        )
        val quoteRequest3 = QuoteRequest(
            content = "This is a test quote3"
        )

        quoteRepository.addQuote(userId = user.id, quote = quoteRequest1)
        quoteRepository.addQuote(userId = user.id, quote = quoteRequest2)
        quoteRepository.addQuote(userId = user.id, quote = quoteRequest3)

        val quotes = quoteRepository.allQuotes()
        assertEquals(3, quotes.size)
        assertEquals("This is a test quote1", quotes[0].content)
        assertEquals("This is a test quote2", quotes[1].content)
        assertEquals("This is a test quote3", quotes[2].content)
    }



    @Test
    fun `test delete quote`() = runBlocking {

        val user = userRepository.create("user@email.com", "user", "password")
        val quoteRequest = QuoteRequest(
            content = "This quote will be deleted"
        )

        val createdQuote = quoteRepository.addQuote(userId = user.id, quote = quoteRequest)
        
        val deleteResult = quoteRepository.deleteQuote(createdQuote.id, user.id)
        assertTrue(deleteResult)

        val deletedQuote = quoteRepository.quote(createdQuote.id)
        assertNull(deletedQuote)
    }

    @Test
    fun `test delete quote with invalid ID returns false`() = runBlocking {
        val user = userRepository.create("user@email.com", "user", "password")

        val deleteResult = quoteRepository.deleteQuote(-1, user.id)
        assertFalse(deleteResult)
    }

    @Test
    fun `test delete quote with wrong user ID returns false`() = runBlocking {
        val user1 = userRepository.create("user1@email.com", "user1", "password")
        val user2 = userRepository.create("user2@email.com", "user2", "password")

        val quoteRequest = QuoteRequest(
            content = "This is an edit quote wrong user"
        )

        val createdQuote = quoteRepository.addQuote(user1.id, quoteRequest)

        val deleteResult = quoteRepository.deleteQuote(createdQuote.id, user2.id)
        assertFalse(deleteResult)
    }
}