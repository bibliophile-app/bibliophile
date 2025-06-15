package com.bibliophile.repositories

import kotlin.test.*
import kotlinx.coroutines.runBlocking
import java.time.LocalDate

import com.bibliophile.models.FollowRequest
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
        val user1 = UserRepository.create("user1@email.com", "user1", "password")
        val user2 = UserRepository.create("user2@email.com", "user2", "password")

        val followRequest = FollowRequest(
            followeeId = user2.id
        )

        val followResult = FollowerRepository.addFollow(userId = user1.id, followRequest)
        assertNotNull(followResult)
        assertEquals(user1.id, followResult.followerId)
        assertEquals(followRequest.followeeId, followResult.followeeId)
    }


    @Test
    fun `test is following`() = runBlocking {
        val user1 = UserRepository.create("user1@email.com", "user1", "password")
        val user2 = UserRepository.create("user2@email.com", "user2", "password")

        val followRequest = FollowRequest(
            followeeId = user2.id
        )

        val followResult = FollowerRepository.addFollow(userId = user1.id, followRequest)
        assertNotNull(followResult)

        val isFollowing = FollowerRepository.isFollowing(user1.id, user2.id)
        assertTrue(isFollowing)
    }

    @Test
    fun `test is not following`() = runBlocking {
        val user1 = UserRepository.create("user1@email.com", "user1", "password")
        val user2 = UserRepository.create("user2@email.com", "user2", "password")

        val isFollowing = FollowerRepository.isFollowing(user1.id, user2.id)
        assertFalse(isFollowing)
    }

    @Test
    fun `test get followers of user`() = runBlocking {
        val user1 = UserRepository.create("user1@email.com", "user1", "password")
        val user2 = UserRepository.create("user2@email.com", "user2", "password")
        val user3 = UserRepository.create("user3@email.com", "user3", "password")

        FollowerRepository.addFollow(userId = user2.id, follow = FollowRequest(followeeId = user1.id))
        FollowerRepository.addFollow(userId = user3.id, follow = FollowRequest(followeeId = user1.id))

        val followers = FollowerRepository.getFollowersOfUser(user1.id)
        assertTrue(followers.any { it.followerId == user2.id })
        assertTrue(followers.any { it.followerId == user3.id })
    }

    @Test
    fun `test get following users`() = runBlocking {
        val user1 = UserRepository.create("user1@email.com", "user1", "password")
        val user2 = UserRepository.create("user2@email.com", "user2", "password")
        val user3 = UserRepository.create("user3@email.com", "user3", "password")

        FollowerRepository.addFollow(userId = user1.id, follow = FollowRequest(followeeId = user2.id))
        FollowerRepository.addFollow(userId = user1.id, follow = FollowRequest(followeeId = user3.id))

        val following = FollowerRepository.getFollowingUsers(user1.id)
        assertTrue(following.any { it.followeeId == user2.id })
        assertTrue(following.any { it.followeeId == user3.id })
    }

    @Test
    fun `test delete follow`() = runBlocking {
        val user1 = UserRepository.create("user1@email.com", "user1", "password")
        val user2 = UserRepository.create("user2@email.com", "user2", "password")

        val followRequest = FollowRequest(
            followeeId = user2.id
        )

        FollowerRepository.addFollow(userId = user1.id, follow = followRequest)

        val deleteResult = FollowerRepository.deleteFollow(userId = user1.id, follow = followRequest)
        assertTrue(deleteResult)

        val isFollowing = FollowerRepository.isFollowing(user1.id, user2.id)
        assertFalse(isFollowing)
    }

    @Test
    fun `test delete follow that does not exist`() = runBlocking {
        val user1 = UserRepository.create("user1@email.com", "user1", "password")
        val user2 = UserRepository.create("user2@email.com", "user2", "password")

        val followRequest = FollowRequest(
            followeeId = user2.id
        )

        val deleteResult = FollowerRepository.deleteFollow(userId = user1.id, follow = followRequest)
        assertFalse(deleteResult)
    }
}
