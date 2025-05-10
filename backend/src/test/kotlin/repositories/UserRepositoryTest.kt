package com.bibliophile.repositories

import kotlin.test.*
import kotlinx.coroutines.runBlocking

import com.bibliophile.models.User
import com.bibliophile.db.TestDatabaseFactory

class UserRepositoryTest {

    private val userRepository = UserRepository()

    @BeforeTest
    fun setup() {
        TestDatabaseFactory.init()
    }

    @AfterTest
    fun teardown() {
        TestDatabaseFactory.reset()
    }

    @Test
    fun `test create user`() = runBlocking {
        val user = userRepository.create("test@example.com", "testuser", "hashedpassword")

        assertNotNull(user)
        assertEquals("test@example.com", user.email)
        assertEquals("testuser", user.username)
    }

    @Test
    fun `test get all users`() = runBlocking {
        userRepository.create("email1", "user1", "password1")
        userRepository.create("email2", "user2", "password2")
        val users = userRepository.getAllUsers()
        assertEquals(2, users.size)
    }

    @Test
    fun `test find user by ID`() = runBlocking {
        val createdUser = userRepository.create(
            email = "test@example.com",
            username = "testuser",
            passwordHash = "hashedpassword"
        )

        val foundUser = userRepository.findById(createdUser.id!!)
        assertNotNull(foundUser)
        assertEquals(createdUser.id, foundUser.id)
        assertEquals(createdUser.username, foundUser.username)
    }

    @Test
    fun `test find user by username`() = runBlocking {
        val createdUser = userRepository.create(
            email = "test@example.com",
            username = "testuser",
            passwordHash = "hashedpassword"
        )

        val foundUser = userRepository.findByUsername("testuser")
        assertNotNull(foundUser)
        assertEquals(createdUser.id, foundUser.id)
        assertEquals(createdUser.email, foundUser.email)
    }

    @Test
    fun `test update user`() = runBlocking {
        val createdUser = userRepository.create(
            email = "test@example.com",
            username = "testuser",
            passwordHash = "hashedpassword"
        )

        val updatedUser = createdUser.copy(username = "updateduser", passwordHash = "newhashedpassword")
        val updateResult = userRepository.update(updatedUser)

        assertTrue(updateResult)

        val foundUser = userRepository.findById(createdUser.id!!)
        assertNotNull(foundUser)
        assertEquals("updateduser", foundUser.username)
        assertEquals("newhashedpassword", foundUser.passwordHash)
    }

    @Test
    fun `test delete user by ID`() = runBlocking {
        val createdUser = userRepository.create(
            email = "test@example.com",
            username = "testuser",
            passwordHash = "hashedpassword"
        )

        val deleteResult = userRepository.delete(createdUser.id!!)
        assertTrue(deleteResult)

        val foundUser = userRepository.findById(createdUser.id!!)
        assertNull(foundUser)
    }

    @Test
    fun `test delete user by username`() = runBlocking {
        val createdUser = userRepository.create(
            email = "test@example.com",
            username = "testuser",
            passwordHash = "hashedpassword"
        )

        val deleteResult = userRepository.delete("testuser")
        assertTrue(deleteResult)

        val foundUser = userRepository.findByUsername("testuser")
        assertNull(foundUser)
    }

    @Test
    fun `test authenticate user with valid credentials`() = runBlocking {
        val createdUser = userRepository.create(
            email = "test@example.com",
            username = "testuser",
            passwordHash = "hashedpassword"
        )

        val authenticatedUser = userRepository.authenticate("testuser", "hashedpassword")
        assertNotNull(authenticatedUser)
        assertEquals(createdUser.id, authenticatedUser.id)
    }

    @Test
    fun `test authenticate user with invalid credentials`() = runBlocking {
        userRepository.create(
            email = "test@example.com",
            username = "testuser",
            passwordHash = "hashedpassword"
        )

        val authenticatedUser = userRepository.authenticate("testuser", "wrongpassword")
        assertNull(authenticatedUser)
    }

    @Test
    fun `test get user profile`() = runBlocking {
        val user = userRepository.create("testemail", "testuser", "hashedpassword")
        val profile = userRepository.getUserProfile(user.id!!)
        assertNotNull(profile)
        assertEquals("testuser", profile.username)
        assertTrue(profile.booklists.isEmpty())
        assertTrue(profile.quotes.isEmpty())
        assertTrue(profile.reviews.isEmpty())
    }
}