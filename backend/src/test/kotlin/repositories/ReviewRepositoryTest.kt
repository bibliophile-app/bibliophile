package com.bibliophile.repositories

import kotlin.test.*
import kotlinx.coroutines.runBlocking
import java.time.LocalDate

import com.bibliophile.models.ReviewRequest
import com.bibliophile.models.UserRequest
import com.bibliophile.models.FollowRequest
import com.bibliophile.utils.TestDatabaseFactory

class ReviewRepositoryTest {

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

    private fun createDefaultReviewRequest() = ReviewRequest(
        bookId = "book123",
        content = "Great book!",
        rate = 5,
        favorite = true,
        reviewedAt = LocalDate.parse("2000-01-01")
    )

    private fun createReviewRequest(bookId: String, content: String) = ReviewRequest(
        bookId = bookId,
        content = content,
        rate = 5,
        favorite = true,
        reviewedAt = LocalDate.parse("2000-01-01")
    )

    @Test
    fun `test create review`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val request = createDefaultReviewRequest()

        val review = ReviewRepository.add(userId = user.id, request = request)

        assertNotNull(review)
        assertEquals(request.bookId, review.bookId)
        assertEquals(request.content, review.content)
        assertEquals(request.rate, review.rate)
        assertEquals(request.favorite, review.favorite)
    }

    @Test
    fun `test get all reviews`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        ReviewRepository.add(user.id, createReviewRequest("book1", "Review 1"))
        ReviewRepository.add(user.id, createReviewRequest("book2", "Review 2"))

        val reviews = ReviewRepository.all()
        assertEquals(2, reviews.size)
        assertEquals("Review 1", reviews[0].content)
        assertEquals("Review 2", reviews[1].content)
    }

    @Test
    fun `test find review by ID`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val request = createDefaultReviewRequest()
        val created = ReviewRepository.add(user.id, request)

        val found = ReviewRepository.findById(created.id)
        assertNotNull(found)
        assertEquals(request.content, found.content)
    }

    @Test
    fun `test find reviews by user ID`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        ReviewRepository.add(user.id, createReviewRequest("book1", "Review 1"))
        ReviewRepository.add(user.id, createReviewRequest("book2", "Review 2"))

        val reviews = ReviewRepository.findByUserId(user.id)
        assertEquals(2, reviews.size)
    }

    @Test
    fun `test find reviews by book ID`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val request = createDefaultReviewRequest()
        ReviewRepository.add(user.id, request)

        val reviews = ReviewRepository.findByBookId(request.bookId)
        assertEquals(1, reviews.size)
        assertEquals(request.content, reviews[0].content)
    }

    @Test
    fun `test find friend reviews for book`() = runBlocking {
        val user = UserRepository.add(createUserRequest("user@test.com", "user", "pw"))
        val friend = UserRepository.add(createUserRequest("friend@test.com", "friend", "pw"))
        
        FollowerRepository.add(user.id, FollowRequest( followeeId = friend.id))
        val reviewRequest = createReviewRequest("book123", "Friend's review")
        ReviewRepository.add(friend.id, reviewRequest)

        val friendReviews = ReviewRepository.findFriendReviewsForBook(user.id, "book123")
        
        assertEquals(1, friendReviews.size)
        assertEquals("Friend's review", friendReviews.first().content)
    }

    @Test
    fun `test find recent reviews from friends`() = runBlocking {
        val user = UserRepository.add(createUserRequest("user@test.com", "user", "pw"))
        val friend = UserRepository.add(createUserRequest("friend@test.com", "friend", "pw"))
        
        FollowerRepository.add(user.id, FollowRequest( followeeId = friend.id))
        ReviewRepository.add(friend.id, createReviewRequest("book123", "Friend's first review"))
        ReviewRepository.add(friend.id, createReviewRequest("book456", "Friend's second review"))

        val recentReviews = ReviewRepository.findRecentReviewsFromFriends(user.id)

        assertEquals(2, recentReviews.size)
        val contents = recentReviews.map { it.content }
        assertTrue(contents.contains("Friend's first review"))
        assertTrue(contents.contains("Friend's second review"))
    }

    @Test
    fun `test find popular books this week`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())

        val recentDate = LocalDate.now().minusDays(2)
        ReviewRepository.add(user.id, createReviewRequest("book123", "Recent review 1").copy(reviewedAt = recentDate))
        ReviewRepository.add(user.id, createReviewRequest("book123", "Recent review 2").copy(reviewedAt = recentDate))
        ReviewRepository.add(user.id, createReviewRequest("book456", "Recent review 3").copy(reviewedAt = recentDate))

        val popularBooks = ReviewRepository.findPopularBooksThisWeek()

        assertTrue(popularBooks.contains("book123"))
        assertTrue(popularBooks.contains("book456"))
        assertEquals("book123", popularBooks.first())
    }


    @Test
    fun `test update review`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val created = ReviewRepository.add(user.id, createDefaultReviewRequest())

        val updateRequest = createReviewRequest(created.bookId, "Updated content")
        val success = ReviewRepository.update(created.id, user.id, updateRequest)
        assertTrue(success)

        val updated = ReviewRepository.findById(created.id)
        assertNotNull(updated)
        assertEquals("Updated content", updated.content)
    }

    @Test
    fun `test update review with invalid ID returns false`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val success = ReviewRepository.update(-1, user.id, createDefaultReviewRequest())
        assertFalse(success)
    }

    @Test
    fun `test update review with wrong user ID returns false`() = runBlocking {
        val user1 = UserRepository.add(createUserRequest("user1@test.com", "user1", "pw1"))
        val user2 = UserRepository.add(createUserRequest("user2@test.com", "user2", "pw2"))
        val created = ReviewRepository.add(user1.id, createDefaultReviewRequest())

        val success = ReviewRepository.update(created.id, user2.id, createDefaultReviewRequest())
        assertFalse(success)
    }

    @Test
    fun `test delete review`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val created = ReviewRepository.add(user.id, createDefaultReviewRequest())

        val success = ReviewRepository.delete(created.id, user.id)
        assertTrue(success)

        val deleted = ReviewRepository.findById(created.id)
        assertNull(deleted)
    }

    @Test
    fun `test delete review with invalid ID returns false`() = runBlocking {
        val user = UserRepository.add(createDefaultUserRequest())
        val success = ReviewRepository.delete(-1, user.id)
        assertFalse(success)
    }

    @Test
    fun `test delete review with wrong user ID returns false`() = runBlocking {
        val user1 = UserRepository.add(createUserRequest("user1@test.com", "user1", "pw1"))
        val user2 = UserRepository.add(createUserRequest("user2@test.com", "user2", "pw2"))
        val created = ReviewRepository.add(user1.id, createDefaultReviewRequest())

        val success = ReviewRepository.delete(created.id, user2.id)
        assertFalse(success)
    }
}