package com.bibliophile.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.bibliophile.models.Review
import com.bibliophile.services.ReviewService
import com.bibliophile.repositories.ReviewRepository

fun Route.reviewRoutes() {

    val reviewService = ReviewService(ReviewRepository())

    route("reviews") {
        
        get {
            call.respond(HttpStatusCode.OK, reviewService.getAllReviews())
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val (status, response) = reviewService.getReviewById(id)
            call.respond(status, response)
        }

        get("/user/{userId}") {
            val userId = call.parameters["userId"]?.toIntOrNull()
            val (status, response) = reviewService.getReviewsByUserId(userId)
            call.respond(status, response)
        }

        get("/book/{isbn}") {
            val isbn = call.parameters["isbn"]
            val (status, response) = reviewService.getReviewsByIsbn(isbn)
            call.respond(status, response)
        }

        post {
            val review = call.receive<Review>()
            val (status, message) = reviewService.addReview(review)
            call.respond(status, mapOf("message" to message))
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val review = call.receive<Review>()
            val updatedReview = review.copy(id = id)
            val (status, message) = reviewService.updateReview(updatedReview)
            call.respond(status, mapOf("message" to message))
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val (status, message) = reviewService.deleteReviewById(id)
            call.respond(status, mapOf("message" to message))
        }

        delete("/user/{userId}") {
            val userId = call.parameters["userId"]?.toIntOrNull()
            val (status, message) = reviewService.deleteReviewsByUserId(userId)
            call.respond(status, mapOf("message" to message))
        }

        delete("/book/{isbn}") {
            val isbn = call.parameters["isbn"]
            val (status, message) = reviewService.deleteReviewsByIsbn(isbn)
            call.respond(status, mapOf("message" to message))
        }
    }
}