package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.server.application.*

import com.bibliophile.models.UserSession
import com.bibliophile.models.ReviewRequest
import com.bibliophile.repositories.ReviewRepository

fun Route.reviewRoutes() {
    route("reviews") {
        get {
            val reviews = ReviewRepository.all()
            call.respond(HttpStatusCode.OK, reviews)
        }

        get("/{id}") {
            val id = call.getIntParam() ?: return@get
            val review = ReviewRepository.findById(id)
            
            if (review != null) {
                call.respond(HttpStatusCode.OK, review)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "Review not found"))
            }
        }

        get("/user/{identifier}") {
            val userId = call.resolveUserIdOrRespondNotFound() ?: return@get
            val reviews = ReviewRepository.findByUserId(userId)
            call.respond(HttpStatusCode.OK, reviews)
        }

        get("/book/{bookId}") {
            val bookId = call.getParam("bookId") ?: return@get
            val session = call.sessions.get<UserSession>()

            val reviews = ReviewRepository.findByBookId(bookId)

            if (session?.userId != null) {
                val userReviews = ReviewRepository.findMyReviewsForBook(session.userId!!, bookId)
                val friendReviews = ReviewRepository.findFriendReviewsForBook(session.userId!!, bookId)

                val excludedIds = buildSet {
                    userReviews.forEach { add(it.id) }
                    friendReviews.forEach { add(it.id) }
                }
                
                val filtered = reviews.filterNot { it.id in excludedIds }

                call.respond(HttpStatusCode.OK, mapOf(
                    "user" to userReviews,
                    "friends" to friendReviews,
                    "others" to filtered
                ))
            } else {
                call.respond(HttpStatusCode.OK, mapOf(
                    "others" to reviews
                ))
            }
        }

        get("/popular/week") {
            val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: 10
            val popularBooks = ReviewRepository.findPopularBooksThisWeek(limit)
            call.respond(HttpStatusCode.OK, popularBooks)
        }

        authenticate("auth-session") {
            get("/popular/friends") {
                val session = call.sessions.get<UserSession>()
                val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: 10
                val reviews = ReviewRepository.findRecentReviewsFromFriends(session?.userId!!, limit)
                call.respond(HttpStatusCode.OK, reviews)
            }

            post {
                val request = call.receive<ReviewRequest>()
                val session = call.sessions.get<UserSession>()

                validateReview(request)?.let {
                    call.respond(it.first, mapOf("message" to it.second))
                    return@post
                }

                val review = ReviewRepository.add(session?.userId!!, request)
                call.respond(
                    HttpStatusCode.Created, 
                    mapOf("message" to "Review created successfully - Review ID: ${review.id}")
                )
            }

            put("/{id}") {
                val id = call.getIntParam() ?: return@put
                val request = call.receive<ReviewRequest>()
                val session = call.sessions.get<UserSession>()

                validateReview(request)?.let {
                    call.respond(it.first, mapOf("message" to it.second))
                    return@put
                }

                val success = ReviewRepository.update(id, session?.userId!!, request)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Review updated successfully"))
                } else {
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this review"))
                }
            }

            delete("/{id}") {
                val id = call.getIntParam() ?: return@delete
                val session = call.sessions.get<UserSession>()

                val success = ReviewRepository.delete(id, session?.userId!!)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Review deleted successfully"))
                } else {
                    call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this review"))
                }
            }
        }
    }
}

private fun validateReview(request: ReviewRequest): Pair<HttpStatusCode, String>? {
    return when {
        request.rate !in 0..10 -> HttpStatusCode.BadRequest to "Rate must be between 0 and 10"
        request.bookId.isBlank() -> HttpStatusCode.BadRequest to "Book ID is required"
        else -> null
    }
}