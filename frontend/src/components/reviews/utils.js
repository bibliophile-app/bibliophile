
const API_URL = "/reviews";

async function fetchReviews()  {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
};

async function searchById(reviewId) {
    if (!reviewId) return;
    try {
      const response = await fetch(`${API_URL}/${reviewId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error searching review:", error);
    }
};

async function searchByBook(bookId) {
    if (!bookId) return;

    try {
      const response = await fetch(`${API_URL}/book/${bookId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error searching review:", error);
    }
};

async function searchByUser(userId) {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error searching review:", error);
    }
};

async function addReview({bookId, content, rate, favorite, reviewedAt}) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          bookId,
          content,
          rate: Number(rate),
          favorite,
          reviewedAt
        })
      });
      return response.ok 
    } catch (error) {
      console.error("Error adding review:", error);
    }
};

async function deleteReview(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE",
        credentials: 'include'
      });
      return response.ok      
    } catch (error) {
      console.error("Error deleting review:", error);
    }
};

async function updateReview(id, {bookId, content, rate, favorite, reviewedAt}) {
    if (!bookId || !rate) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          bookId,
          content,
          favorite,
          reviewedAt,
          rate: Number(rate),
        })
      });
      
      return response.ok
    } catch (error) {
      console.error("Error updating review:", error);
    }
};

export {fetchReviews, searchById, searchByBook, searchByUser, addReview, deleteReview, updateReview};
