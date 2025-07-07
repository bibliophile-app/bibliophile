package com.bibliophile.repositories

import kotlin.test.*
import kotlinx.coroutines.runBlocking
import java.time.LocalDate

import com.bibliophile.models.FollowRequest
import com.bibliophile.models.UserRequest
import com.bibliophile.utils.TestDatabaseFactory

class FollowerRepositoryTest {

    @BeforeTest
    fun setup() {
        TestDatabaseFactory.init()
    }

    @AfterTest
    fun teardown() {
        TestDatabaseFactory.reset()
    }

    @Test
    fun `test add follow`() = runBlocking {
        val user1 = UserRepository.add(UserRequest(email = "user1@email.com", username = "user1", password = "password"))
        val user2 = UserRepository.add(UserRequest(email = "user2@email.com", username = "user2", password = "password"))

        val followRequest = FollowRequest(
            followeeId = user2.id
        )

        val followResult = FollowerRepository.add(userId = user1.id, request = followRequest)
        assertNotNull(followResult)
        assertEquals(user1.id, followResult.followerId)
        assertEquals(followRequest.followeeId, followResult.followeeId)
    }

    @Test
    fun `test is following`() = runBlocking {
        val user1 = UserRepository.add(UserRequest(email = "user1@email.com", username = "user1", password = "password"))
        val user2 = UserRepository.add(UserRequest(email = "user2@email.com", username = "user2", password = "password"))

        val followRequest = FollowRequest(
            followeeId = user2.id
        )

        val followResult = FollowerRepository.add(userId = user1.id, request = followRequest)
        assertNotNull(followResult)

        val isFollowing = FollowerRepository.exists(user1.id, user2.id)
        assertTrue(isFollowing)
    }

    @Test
    fun `test is not following`() = runBlocking {
        val user1 = UserRepository.add(UserRequest(email = "user1@email.com", username = "user1", password = "password"))
        val user2 = UserRepository.add(UserRequest(email = "user2@email.com", username = "user2", password = "password"))

        val isFollowing = FollowerRepository.exists(user1.id, user2.id)
        assertFalse(isFollowing)
    }

    @Test
    fun `test get followers of user`() = runBlocking {
        val user1 = UserRepository.add(UserRequest(email = "user1@email.com", username = "user1", password = "password"))
        val user2 = UserRepository.add(UserRequest(email = "user2@email.com", username = "user2", password = "password"))
        val user3 = UserRepository.add(UserRequest(email = "user3@email.com", username = "user3", password = "password"))

        FollowerRepository.add(userId = user2.id, request = FollowRequest(followeeId = user1.id))
        FollowerRepository.add(userId = user3.id, request = FollowRequest(followeeId = user1.id))

        val followers = FollowerRepository.findByFolloweeId(user1.id)
        assertTrue(followers.any { it.followerId == user2.id })
        assertTrue(followers.any { it.followerId == user3.id })
    }

    @Test
    fun `test get following users`() = runBlocking {
        val user1 = UserRepository.add(UserRequest(email = "user1@email.com", username = "user1", password = "password"))
        val user2 = UserRepository.add(UserRequest(email = "user2@email.com", username = "user2", password = "password"))
        val user3 = UserRepository.add(UserRequest(email = "user3@email.com", username = "user3", password = "password"))

        FollowerRepository.add(userId = user1.id, request = FollowRequest(followeeId = user2.id))
        FollowerRepository.add(userId = user1.id, request = FollowRequest(followeeId = user3.id))

        val following = FollowerRepository.findByFollowerId(user1.id)
        assertTrue(following.any { it.followeeId == user2.id })
        assertTrue(following.any { it.followeeId == user3.id })
    }

    @Test
    fun `test delete follow`() = runBlocking {
        val user1 = UserRepository.add(UserRequest(email = "user1@email.com", username = "user1", password = "password"))
        val user2 = UserRepository.add(UserRequest(email = "user2@email.com", username = "user2", password = "password"))

        val followRequest = FollowRequest(
            followeeId = user2.id
        )

        FollowerRepository.add(userId = user1.id, request = followRequest)

        val deleteResult = FollowerRepository.delete(userId = user1.id, request = followRequest)
        assertTrue(deleteResult)

        val isFollowing = FollowerRepository.exists(user1.id, user2.id)
        assertFalse(isFollowing)
    }

    @Test
    fun `test delete follow that does not exist`() = runBlocking {
        val user1 = UserRepository.add(UserRequest(email = "user1@email.com", username = "user1", password = "password"))
        val user2 = UserRepository.add(UserRequest(email = "user2@email.com", username = "user2", password = "password"))

        val followRequest = FollowRequest(
            followeeId = user2.id
        )

        val deleteResult = FollowerRepository.delete(userId = user1.id, request = followRequest)
        assertFalse(deleteResult)
    }
}
