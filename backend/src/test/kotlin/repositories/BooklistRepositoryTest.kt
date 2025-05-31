package com.bibliophile.repositories

import kotlin.test.*
import kotlinx.coroutines.runBlocking

import com.bibliophile.models.BooklistRequest
import com.bibliophile.models.UserRequest
import com.bibliophile.utils.TestDatabaseFactory

class BooklistRepositoryTest {

    @BeforeTest
    fun setup() {
        TestDatabaseFactory.init()
    }

    @AfterTest
    fun teardown() {
        TestDatabaseFactory.reset()
    }

    private fun createDefaultUserRequest() = UserRequest(
        email = "test@example.com",
        username = "testuser",
        password = "hashedpassword"
    )

    private fun createUserRequest(email: String, username: String, password: String) = UserRequest(
        email = email,
        username = username,
        password = password
    )

    private fun createDefaultBooklistRequest() = BooklistRequest(
        listName = "My Booklist",
        listDescription = "A list of my favorite books"
    )

    @Test
    fun `test create booklist`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val request = createDefaultBooklistRequest()

        val booklist = BooklistRepository.add(userId = user.id, request = request)

        val booklists = BooklistRepository.all()
        assertEquals(1, booklists.size)
        assertEquals("My Booklist", booklists[0].listName)
        assertEquals("A list of my favorite books", booklists[0].listDescription)
    }

    @Test
    fun `test get booklist by ID`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val request = createDefaultBooklistRequest()

        val booklist = BooklistRepository.add(userId = user.id, request = request)
        val found = BooklistRepository.findById(booklist.id)

        assertNotNull(found)
        assertEquals("My Booklist", found.listName)
        assertEquals("A list of my favorite books", found.listDescription)
    }

    @Test
    fun `test get booklist with invalid ID returns null`() = runBlocking {
        val result = BooklistRepository.findById(-1)
        assertNull(result)
    }

    @Test
    fun `test update booklist`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val booklist = BooklistRepository.add(userId = user.id, request = createDefaultBooklistRequest())

        val updateRequest = BooklistRequest(
            listName = "Updated Booklist",
            listDescription = "An updated description"
        )

        val success = BooklistRepository.update(booklist.id, userId = user.id, request = updateRequest)
        assertTrue(success)

        val updated = BooklistRepository.findById(booklist.id)
        assertNotNull(updated)
        assertEquals("Updated Booklist", updated.listName)
        assertEquals("An updated description", updated.listDescription)
    }

    @Test
    fun `test update booklist with invalid ID returns false`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val success = BooklistRepository.update(
            id = -1,
            userId = user.id,
            request = createDefaultBooklistRequest()
        )
        assertFalse(success)
    }

    @Test
    fun `test update booklist with wrong user ID returns false`() = runBlocking {
        val user1 = UserRepository.add(createUserRequest("a@a.com", "user1", "pw1"))
        val user2 = UserRepository.add(createUserRequest("b@b.com", "user2", "pw2"))
        val booklist = BooklistRepository.add(user1.id, createDefaultBooklistRequest())

        val success = BooklistRepository.update(booklist.id, user2.id, createDefaultBooklistRequest())
        assertFalse(success)
    }

    @Test
    fun `test delete booklist`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val booklist = BooklistRepository.add(userId = user.id, request = createDefaultBooklistRequest())

        val success = BooklistRepository.delete(booklist.id, userId = user.id)
        assertTrue(success)

        val deleted = BooklistRepository.findById(booklist.id)
        assertNull(deleted)
    }

    @Test
    fun `test delete booklist with invalid ID returns false`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val success = BooklistRepository.delete(-1, user.id)
        assertFalse(success)
    }

    @Test
    fun `test delete booklist with wrong user ID returns false`() = runBlocking {
        val user1 = UserRepository.add(createUserRequest("a@a.com", "user1", "pw1"))
        val user2 = UserRepository.add(createUserRequest("b@b.com", "user2", "pw2"))
        val booklist = BooklistRepository.add(user1.id, createDefaultBooklistRequest())

        val success = BooklistRepository.delete(booklist.id, user2.id)
        assertFalse(success)
    }

    @Test
    fun `test add book to booklist`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val booklist = BooklistRepository.add(userId = user.id, request = createDefaultBooklistRequest())

        val success = BooklistRepository.addBookToList(booklist.id, userId = user.id, bookId = "book123")
        assertTrue(success)

        val booklistWithBooks = BooklistRepository.findWithBooks(booklist.id)
        assertNotNull(booklistWithBooks)
        assertEquals(1, booklistWithBooks.books.size)
        assertEquals("book123", booklistWithBooks.books[0])
    }

    @Test
    fun `test add book to nonexistent booklist returns false`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val success = BooklistRepository.addBookToList(-1, user.id, "book123")
        assertFalse(success)
    }

    @Test
    fun `test add book with wrong user ID returns false`() = runBlocking {
        val user1 = UserRepository.add(createUserRequest("a@a.com", "user1", "pw1"))
        val user2 = UserRepository.add(createUserRequest("b@b.com", "user2", "pw2"))
        val booklist = BooklistRepository.add(user1.id, createDefaultBooklistRequest())

        val success = BooklistRepository.addBookToList(booklist.id, user2.id, "book123")
        assertFalse(success)
    }

    @Test
    fun `test remove book from booklist`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val booklist = BooklistRepository.add(userId = user.id, request = createDefaultBooklistRequest())

        BooklistRepository.addBookToList(booklist.id, userId = user.id, bookId = "book123")
        val success = BooklistRepository.removeBookFromList(booklist.id, userId = user.id, bookId = "book123")
        assertTrue(success)

        val booklistWithBooks = BooklistRepository.findWithBooks(booklist.id)
        assertNotNull(booklistWithBooks)
        assertTrue(booklistWithBooks.books.isEmpty())
    }

    @Test
    fun `test remove book from nonexistent booklist returns false`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val success = BooklistRepository.removeBookFromList(-1, user.id, "book123")
        assertFalse(success)
    }

    @Test
    fun `test remove book with wrong user ID returns false`() = runBlocking {
        val user1 = UserRepository.add(createUserRequest("a@a.com", "user1", "pw1"))
        val user2 = UserRepository.add(createUserRequest("b@b.com", "user2", "pw2"))
        val booklist = BooklistRepository.add(user1.id, createDefaultBooklistRequest())
        BooklistRepository.addBookToList(booklist.id, user1.id, "book123")

        val success = BooklistRepository.removeBookFromList(booklist.id, user2.id, "book123")
        assertFalse(success)
    }
}