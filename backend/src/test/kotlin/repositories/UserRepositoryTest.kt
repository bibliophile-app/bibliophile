package com.bibliophile.repositories

import kotlin.test.*
import kotlinx.coroutines.runBlocking

import com.bibliophile.models.User
import com.bibliophile.models.UserRequest
import com.bibliophile.utils.TestDatabaseFactory

class UserRepositoryTest {

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

    @Test
    fun `test create user`() = runBlocking {
        val request = createDefaultUserRequest()
        val user = UserRepository.add(request)

        assertNotNull(user)
        assertEquals(request.email, user.email)
        assertEquals(request.username, user.username)
    }

    @Test
    fun `test get all users`() = runBlocking {
        UserRepository.add(createUserRequest("email1", "user1", "password1"))
        UserRepository.add(createUserRequest("email2", "user2", "password2"))
        
        val users = UserRepository.all()
        assertEquals(2, users.size)
    }

    @Test
    fun `test find user by ID`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val found = UserRepository.findById(user.id)

        assertNotNull(found)
        assertEquals(user.id, found.id)
        assertEquals(user.username, found.username)
    }

    @Test
    fun `test find user by invalid ID returns null`() = runBlocking {
        val user = UserRepository.findById(-1)
        assertNull(user)
    }

    @Test
    fun `test find user by username`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val found = UserRepository.findByUsername("testuser")

        assertNotNull(found)
        assertEquals(user.id, found.id)
        assertEquals(user.email, found.email)
    }

    @Test
    fun `test update user`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val updateRequest = createUserRequest("new@email.com", "newuser", "newpassword")

        val success = UserRepository.update(user.id, updateRequest)
        assertTrue(success)

        val updated = UserRepository.findById(user.id)
        assertNotNull(updated)
        assertEquals("newuser", updated.username)
    }

    @Test
    fun `test update non-existent user returns false`() = runBlocking {
        val success = UserRepository.update(-1, createDefaultUserRequest())
        assertFalse(success)
    }

    @Test
    fun `test delete user by ID`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        
        val sucess = UserRepository.delete(user.id!!)
        assertTrue(sucess)

        val found = UserRepository.findById(user.id!!)
        assertNull(found)
    }

    @Test
    fun `test delete user by invalid ID returns false`() = runBlocking {
        val result = UserRepository.delete(-1)
        assertFalse(result)
    }

    @Test
    fun `test authenticate user with valid credentials`() = runBlocking {
        val request = createDefaultUserRequest()
        UserRepository.add(request)

        val user = UserRepository.authenticate("testuser", "hashedpassword")
        assertNotNull(user)
        assertEquals(request.username, user.username)
    }

    @Test
    fun `test authenticate user with invalid credentials returns null`() = runBlocking {
        val request = createDefaultUserRequest()
        UserRepository.add(request)

        val user = UserRepository.authenticate(request.username, "wrongpassword")
        assertNull(user)
    }

    @Test
    fun `test get user profile`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val profile = UserRepository.findProfileById(user.id!!)
        assertNotNull(profile)
        assertEquals("testuser", profile.username)
        assertTrue(profile.quotes.isEmpty())
    }

    @Test
    fun `test get user profile with invalid ID returns null`() = runBlocking {
        val profile = UserRepository.findProfileById(-1)
        assertNull(profile)
    }
}