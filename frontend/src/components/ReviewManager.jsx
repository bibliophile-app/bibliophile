import { useEffect, useState } from "react";

const API_URL = "/reviews";

export default function ReviewManager() {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const [reviews, setReviews] = useState([]);
  const [bookId, setBookId] = useState("");
  const [content, setContent] = useState("");
  const [rate, setRate] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [foundReview, setFoundReview] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [newBookId, setNewBookId] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newFavorite, setNewFavorite] = useState(false);
  const [reviewedAt, setReviewedAt] = useState(today);
  const [newReviewedAt, setNewReviewedAt] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    try {
      const response = await fetch(`${API_URL}/${searchId}`);
      if (response.ok) {
        const data = await response.json();
        setFoundReview(data);
      } else {
        setFoundReview(null);
      }
    } catch (error) {
      console.error("Error searching review:", error);
    }
  };

  const handleAddReview = async () => {
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
      if (response.ok) {
        fetchReviews();
        setBookId("");
        setContent("");
        setRate("");
        setFavorite(false);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE",
        credentials: 'include'
      });
      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleEditReview = (review) => {
    setEditReview(review);
    setNewBookId(review.bookId);
    setNewContent(review.content);
    setNewRate(String(review.rate));
    setNewFavorite(review.favorite);
    setNewReviewedAt(review.reviewedAt);
  };

  const handleUpdateReview = async () => {
    if (!editReview) return;
    try {
      const response = await fetch(`${API_URL}/${editReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          bookId: newBookId,
          content: newContent,
          rate: Number(newRate),
          favorite: newFavorite,
          reviewedAt: newReviewedAt
        })
      });
      if (response.ok) {
        fetchReviews();
        setEditReview(null);
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Review Management</h1>
      
      {/* Add Review Form */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Review</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Book ID" value={bookId} onChange={(e) => setBookId(e.target.value)} className="border p-2" />
          <textarea placeholder="Review Content" value={content} onChange={(e) => setContent(e.target.value)} className="border p-2 col-span-2" />
          <div className="flex items-center gap-4">
            <input type="number" min="0" max="10" placeholder="Rating (0-10)" value={rate} onChange={(e) => setRate(e.target.value)} className="border p-2 flex-1" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} className="w-4 h-4" />
              Favorite
            </label>
            <input
              type="date"
              value={reviewedAt}
              onChange={(e) => setReviewedAt(e.target.value)}
              className="border p-2"
            />
          </div>
          <button onClick={handleAddReview} className="bg-blue-500 text-white p-2 col-span-2">Add Review</button>
        </div>
      </div>

      {/* Search by ID */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Search Review by ID</h2>
        <div className="flex gap-2">
          <input type="number" placeholder="Review ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="border p-2 flex-1" />
          <button onClick={handleSearchById} className="bg-green-500 text-white p-2">Search</button>
        </div>
        {foundReview && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h3 className="font-semibold">Found Review:</h3>
            <p>Book ID: {foundReview.bookId}</p>
            <p>User ID: {foundReview.userId}</p>
            <p>Rate: {foundReview.rate / 2}/5</p>
            <p>
              Reviewed: {new Date(foundReview.reviewedAt + 'T00:00:00').toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
              })}
            </p>
            <p>{foundReview.content}</p>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Reviews</h2>
        <div className="space-y-2">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">Book ID: {review.bookId}</div>
                <div>User ID: {review.userId} | Rate: {review.rate / 2}/5 | Reviewed: {new Date(review.reviewedAt + 'T00:00:00').toLocaleDateString("pt-BR")} </div>
                <div className="text-gray-600">{review.content}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditReview(review)} className="bg-yellow-500 text-white p-2">Edit</button>
                <button onClick={() => handleDeleteReview(review.id)} className="bg-red-500 text-white p-2">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Review Form */}
      {editReview && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Edit Review</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Book ID" value={newBookId} onChange={(e) => setNewBookId(e.target.value)} className="border p-2" />
            <textarea placeholder="Review Content" value={newContent} onChange={(e) => setNewContent(e.target.value)} className="border p-2 col-span-2" />
            <div className="flex items-center gap-4">
              <input type="number" min="0" max="10" placeholder="Rating" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="border p-2 flex-1" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={newFavorite} onChange={(e) => setNewFavorite(e.target.checked)} className="w-4 h-4" />
                Favorite
              </label>
              <input
                type="date"
                value={newReviewedAt}
                onChange={(e) => setNewReviewedAt(e.target.value)}
                className="border p-2"
              />
            </div>
            <button onClick={handleUpdateReview} className="bg-blue-500 text-white p-2">Update Review</button>
            <button onClick={() => setEditReview(null)} className="bg-gray-500 text-white p-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}