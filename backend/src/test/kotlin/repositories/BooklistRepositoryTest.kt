package com.bibliophile.repositories

import kotlin.test.*
import kotlinx.coroutines.runBlocking

import com.bibliophile.models.BooklistRequest
import com.bibliophile.utils.TestDatabaseFactory

class BooklistRepositoryTest {

    private val userRepository = UserRepository()
    private val booklistRepository = BooklistRepository()

    @BeforeTest
    fun setup() {
        TestDatabaseFactory.init()
    }

    @AfterTest
    fun teardown() {
        TestDatabaseFactory.reset()
    }

    @Test
    fun `test create booklist`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")
        val booklistRequest = BooklistRequest(
            listName = "My Booklist",
            listDescription = "A list of my favorite books"
        )

        booklistRepository.addBooklist(userId = user.id, booklist = booklistRequest)

        val booklists = booklistRepository.allBooklists()
        assertEquals(1, booklists.size)
        assertEquals("My Booklist", booklists[0].listName)
        assertEquals("A list of my favorite books", booklists[0].listDescription)
    }

    @Test
    fun `test get booklist by ID`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")
        val booklistRequest = BooklistRequest(
            listName = "My Booklist",
            listDescription = "A list of my favorite books"
        )

        booklistRepository.addBooklist(userId = user.id, booklist = booklistRequest)
        val booklists = booklistRepository.allBooklists()
        val booklistId = booklists[0].id

        val booklist = booklistRepository.booklist(booklistId)
        assertNotNull(booklist)
        assertEquals("My Booklist", booklist.listName)
        assertEquals("A list of my favorite books", booklist.listDescription)
    }

    @Test
    fun `test get booklist with invalid ID returns null`() = runBlocking {
        val result = booklistRepository.booklist(-1)
        assertNull(result)
    }

    @Test
    fun `test update booklist`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")
        val booklistRequest = BooklistRequest(
            listName = "My Booklist",
            listDescription = "A list of my favorite books"
        )

        booklistRepository.addBooklist(userId = user.id, booklist = booklistRequest)
        val booklists = booklistRepository.allBooklists()
        val booklistId = booklists[0].id

        val updatedRequest = BooklistRequest(
            listName = "Updated Booklist",
            listDescription = "An updated description"
        )

        val updateResult = booklistRepository.updateBooklist(booklistId, userId = user.id, updatedBooklist = updatedRequest)
        assertTrue(updateResult)

        val updatedBooklist = booklistRepository.booklist(booklistId)
        assertNotNull(updatedBooklist)
        assertEquals("Updated Booklist", updatedBooklist.listName)
        assertEquals("An updated description", updatedBooklist.listDescription)
    }

    @Test
    fun `test update booklist with invalid ID returns false`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")

        val updateResult = booklistRepository.updateBooklist(
            booklistId = -1,
            userId = user.id,
            updatedBooklist = BooklistRequest("New name", "New desc")
        )
        assertFalse(updateResult)
    }

    @Test
    fun `test update booklist with wrong user ID returns false`() = runBlocking {
        val user1 = userRepository.create("a@a.com", "user1", "pw1")
        val user2 = userRepository.create("b@b.com", "user2", "pw2")
        val booklist = booklistRepository.addBooklist(user1.id, BooklistRequest("Name", "Desc"))

        val result = booklistRepository.updateBooklist(booklist.id, user2.id, BooklistRequest("X", "Y"))
        assertFalse(result)
    }

    @Test
    fun `test delete booklist`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")
        val booklistRequest = BooklistRequest(
            listName = "My Booklist",
            listDescription = "A list of my favorite books"
        )

        booklistRepository.addBooklist(userId = 1, booklist = booklistRequest)
        val booklists = booklistRepository.allBooklists()
        val booklistId = booklists[0].id

        val deleteResult = booklistRepository.removeBooklist(booklistId, userId = user.id)
        assertTrue(deleteResult)

        val deletedBooklist = booklistRepository.booklist(booklistId)
        assertNull(deletedBooklist)
    }

    @Test
    fun `test remove booklist with invalid ID returns false`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")

        val result = booklistRepository.removeBooklist(-1, user.id)
        assertFalse(result)
    }

    @Test
    fun `test remove booklist with wrong user ID returns false`() = runBlocking {
        val user1 = userRepository.create("a@a.com", "user1", "pw1")
        val user2 = userRepository.create("b@b.com", "user2", "pw2")
        val booklist = booklistRepository.addBooklist(user1.id, BooklistRequest("Name", "Desc"))

        val result = booklistRepository.removeBooklist(booklist.id, user2.id)
        assertFalse(result)
    }

    @Test
    fun `test add book to booklist`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")
        val booklistRequest = BooklistRequest(
            listName = "My Booklist",
            listDescription = "A list of my favorite books"
        )

        booklistRepository.addBooklist(userId = 1, booklist = booklistRequest)
        val booklists = booklistRepository.allBooklists()
        val booklistId = booklists[0].id

        val addBookResult = booklistRepository.addBookToBooklist(booklistId, userId = user.id, bookId = "book123")
        assertTrue(addBookResult)

        val booklistWithBooks = booklistRepository.booklistWithBooks(booklistId)
        assertNotNull(booklistWithBooks)
        assertEquals(1, booklistWithBooks.books.size)
        assertEquals("book123", booklistWithBooks.books[0])
    }

    @Test
    fun `test add book to nonexistent booklist returns false`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")
        val result = booklistRepository.addBookToBooklist(-1, user.id, "book123")
        assertFalse(result)
    }

    @Test
    fun `test add book to booklist with wrong user ID returns false`() = runBlocking {
        val user1 = userRepository.create("a@a.com", "user1", "pw1")
        val user2 = userRepository.create("b@b.com", "user2", "pw2")
        val booklist = booklistRepository.addBooklist(user1.id, BooklistRequest("Name", "Desc"))

        val result = booklistRepository.addBookToBooklist(booklist.id, user2.id, "book123")
        assertFalse(result)
    }

    @Test
    fun `test remove book from booklist`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")
        val booklistRequest = BooklistRequest(
            listName = "My Booklist",
            listDescription = "A list of my favorite books"
        )

        booklistRepository.addBooklist(userId = 1, booklist = booklistRequest)
        val booklists = booklistRepository.allBooklists()
        val booklistId = booklists[0].id

        booklistRepository.addBookToBooklist(booklistId, userId = user.id, bookId = "book123")
        val removeBookResult = booklistRepository.removeBookFromBooklist(booklistId, userId = user.id, bookId = "book123")
        assertTrue(removeBookResult)

        val booklistWithBooks = booklistRepository.booklistWithBooks(booklistId)
        assertNotNull(booklistWithBooks)
        assertTrue(booklistWithBooks.books.isEmpty())
    }

    @Test
    fun `test remove book from nonexistent booklist returns false`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")
        val result = booklistRepository.removeBookFromBooklist(-1, user.id, "book123")
        assertFalse(result)
    }


    @Test
    fun `test remove book to booklist with wrong user ID returns false`() = runBlocking {
        val user1 = userRepository.create("a@a.com", "user1", "pw1")
        val user2 = userRepository.create("b@b.com", "user2", "pw2")
        val booklist = booklistRepository.addBooklist(user1.id, BooklistRequest("Name", "Desc"))
        val booklistBook = booklistRepository.addBookToBooklist(booklist.id, user1.id, "book123")

        val result = booklistRepository.removeBookFromBooklist(booklist.id, user2.id, "book123")
        assertFalse(result)
    }

    @Test
    fun `test get booklist with books for invalid ID returns null`() = runBlocking {
        val result = booklistRepository.booklistWithBooks(-1)
        assertNull(result)
    }

    @Test
    fun `test booklistWithBooks returns empty description when null`() = runBlocking {
        val user = userRepository.create("null@desc.com", "user", "pw")

        val booklist = booklistRepository.addBooklist(
            userId = user.id,
            booklist = BooklistRequest(
                listName = "No description",
                listDescription = null
            )
        )

        val result = booklistRepository.booklistWithBooks(booklist.id)
        assertNotNull(result)
        assertEquals("", result.listDescription)
    }
}