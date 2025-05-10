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
    val reviewRepository = ReviewRepository()

    route("reviews") {
        
        get {
            runCatching {
                reviewRepository.allReviews()
            }.onSuccess {
                call.respond(HttpStatusCode.OK, it)
            }.onFailure {
                call.respondServerError("Failed to retrieve reviews")
            }
        }

        get("/{id}") {
            val id = call.getIntParam() ?: return@get

            runCatching {
                reviewRepository.review(id)
            }.onSuccess { review ->
                if (review != null) {
                    call.respond(HttpStatusCode.OK, review)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Review not found"))
                }
            }.onFailure {
                call.respondServerError("Error retrieving review")
            }
        }

        get("/user/{userId}") {
            val userId = call.getIntParam("userId") ?: return@get

            runCatching {
                reviewRepository.getReviewsByUserId(userId)
            }.onSuccess { reviews ->
                call.respond(HttpStatusCode.OK, reviews)
            }.onFailure {
                call.respondServerError("Error retrieving reviews")
            }
        }

        get("/book/{bookId}") {
            val bookId = call.getParam("bookId") ?: return@get

            runCatching {
                reviewRepository.getReviewsById(bookId)
            }.onSuccess { reviews ->
                call.respond(HttpStatusCode.OK, reviews)
            }.onFailure {
                call.respondServerError("Error retrieving reviews")
            }
        }

        authenticate("auth-session") { 
            post {
                val review = call.receive<ReviewRequest>()
                val session = call.sessions.get<UserSession>()

                validateReview(review)?.let {
                    call.respond(it.first, mapOf("message" to it.second))
                    return@post
                }
            
                runCatching {
                    reviewRepository.addReview(session?.userId!!, review)
                }.onSuccess {
                    call.respond(HttpStatusCode.Created, mapOf("message" to "Review created successfully"))
                }.onFailure {
                    call.respondSqlException(it) { ex ->
                        ex.message?.contains("unique constraint", ignoreCase = true) == true
                    }
                }            
            }
            
            put("/{id}") {
                val id = call.getIntParam() ?: return@put       
                val review = call.receive<ReviewRequest>()
                val session = call.sessions.get<UserSession>()

                validateReview(review)?.let {
                    call.respond(it.first, mapOf("message" to it.second))
                    return@put
                }
                
                runCatching {
                    reviewRepository.updateReview(id, session?.userId!!, review)
                }.onSuccess {    
                    if (it) {
                        call.respond(HttpStatusCode.OK, mapOf("message" to "Review updated successfully"))
                    } else {
                        call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this review"))
                    }
                }.onFailure {
                    call.respondServerError("Failed to update review")
                }
            }

            delete("/{id}") {
                val id = call.getIntParam() ?: return@delete
                val session = call.sessions.get<UserSession>()
            
                runCatching {
                    reviewRepository.deleteReview(id, session?.userId!!)
                }.onSuccess {
                    if (it) {
                        call.respond(HttpStatusCode.OK, mapOf("message" to "Review deleted successfully"))
                    } else {
                        call.respond(HttpStatusCode.Forbidden, mapOf("message" to "You don't own this review"))
                    }
                }.onFailure {
                    call.respondServerError("Failed to delete review")
                }
            }        
        }
    }
}

private fun validateReview(review: ReviewRequest): Pair<HttpStatusCode, String>? {
    return when {
        review.content.isBlank() -> HttpStatusCode.BadRequest to "Review content cannot be empty"
        review.rate !in 0..10 -> HttpStatusCode.BadRequest to "Rate must be between 0 and 10"
        review.bookId.isBlank() -> HttpStatusCode.BadRequest to "Book ID is required"
        else -> null
    }
}