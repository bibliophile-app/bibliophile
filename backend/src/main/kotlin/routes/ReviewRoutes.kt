package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.application.*
import com.bibliophile.models.Review
import com.bibliophile.repositories.ReviewRepository

fun Route.reviewRoutes() {
    val reviewRepository = ReviewRepository()

    route("reviews") {
        
        get {
            runCatching {
                reviewRepository.getAllReviews()
            }.onSuccess {
                call.respond(HttpStatusCode.OK, it)
            }.onFailure {
                call.respondServerError("Failed to retrieve reviews")
            }
        }

        get("/{id}") {
            val id = call.getIntParam() ?: return@get

            runCatching {
                reviewRepository.getReviewById(id)
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
                if (reviews != null) {
                    call.respond(HttpStatusCode.OK, reviews)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Reviews not found"))
                }
            }.onFailure {
                call.respondServerError("Error retrieving reviews")
            }
        }

        get("/book/{isbn}") {
            val isbn = call.getParam("isbn") ?: return@get

            runCatching {
                reviewRepository.getReviewsByIsbn(isbn)
            }.onSuccess { reviews ->
                if (reviews != null) {
                    call.respond(HttpStatusCode.OK, reviews)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Reviews not found"))
                }
            }.onFailure {
                call.respondServerError("Error retrieving reviews")
            }
        }

        post {
            val review = call.receive<Review>()
        
            validateReview(review)?.let {
                call.respond(it.first, mapOf("message" to it.second))
                return@post
            }
        
            runCatching {
                reviewRepository.addReview(review)
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
            val review = call.receive<Review>()
            val updatedReview = review.copy(id = id)
        
            validateReview(updatedReview)?.let {
                call.respond(it.first, mapOf("message" to it.second))
                return@put
            }
        
            runCatching {
                reviewRepository.updateReview(updatedReview)
            }.onSuccess { updated ->
                if (updated) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Review updated successfully"))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Review not found"))
                }
            }.onFailure {
                call.respondSqlException(it)
            }
        }
        

        delete("/{id}") {
            val id = call.getIntParam() ?: return@delete

            runCatching {
                reviewRepository.deleteReviewById(id)
            }.onSuccess {
                if (it)
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Review deleted successfully"))
                else
                    call.respond(HttpStatusCode.NotFound, mapOf("message" to "Review not found"))
            }.onFailure {
                call.respondServerError("Failed to delete review")
            }
        }
    }
}

private fun validateReview(review: Review): Pair<HttpStatusCode, String>? {
    return when {
        review.content.isBlank() -> HttpStatusCode.BadRequest to "Review content cannot be empty"
        review.rate !in 1..10 -> HttpStatusCode.BadRequest to "Rating must be between 1 and 10"
        review.isbn.isBlank() -> HttpStatusCode.BadRequest to "ISBN is required"
        else -> null
    }
}
