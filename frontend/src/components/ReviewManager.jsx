import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/reviews";

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [isbn, setIsbn] = useState("");
  const [userId, setUserId] = useState("");
  const [content, setContent] = useState("");
  const [rate, setRate] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [foundReview, setFoundReview] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [newISBN, setNewISBN] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newFavorite, setNewFavorite] = useState(false);

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
        body: JSON.stringify({
          isbn,
          userId: Number(userId),
          content,
          rate: Number(rate),
          favorite
        })
      });
      if (response.ok) {
        fetchReviews();
        setIsbn("");
        setUserId("");
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
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleEditReview = (review) => {
    setEditReview(review);
    setNewISBN(review.isbn);
    setNewUserId(String(review.userId));
    setNewContent(review.content);
    setNewRate(String(review.rate));
    setNewFavorite(review.favorite);
  };

  const handleUpdateReview = async () => {
    if (!editReview) return;
    try {
      const response = await fetch(`${API_URL}/${editReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editReview.id,
          isbn: newISBN,
          userId: Number(newUserId),
          content: newContent,
          rate: Number(newRate),
          favorite: newFavorite
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
          <input type="text" placeholder="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} className="border p-2" />
          <input type="number" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} className="border p-2" />
          <textarea placeholder="Review Content" value={content} onChange={(e) => setContent(e.target.value)} className="border p-2 col-span-2" />
          <div className="flex items-center gap-4">
            <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={rate} onChange={(e) => setRate(e.target.value)} className="border p-2 flex-1" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} className="w-4 h-4" />
              Favorite
            </label>
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
            <p>ISBN: {foundReview.isbn}</p>
            <p>User ID: {foundReview.userId}</p>
            <p>Rating: {foundReview.rate}/5</p>
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
                <div className="font-semibold">ISBN: {review.isbn}</div>
                <div>User ID: {review.userId} | Rating: {review.rate}/5</div>
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
            <input type="text" placeholder="ISBN" value={newISBN} onChange={(e) => setNewISBN(e.target.value)} className="border p-2" />
            <input type="number" placeholder="User ID" value={newUserId} onChange={(e) => setNewUserId(e.target.value)} className="border p-2" />
            <textarea placeholder="Review Content" value={newContent} onChange={(e) => setNewContent(e.target.value)} className="border p-2 col-span-2" />
            <div className="flex items-center gap-4">
              <input type="number" min="1" max="5" placeholder="Rating" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="border p-2 flex-1" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={newFavorite} onChange={(e) => setNewFavorite(e.target.checked)} className="w-4 h-4" />
                Favorite
              </label>
            </div>
            <button onClick={handleUpdateReview} className="bg-blue-500 text-white p-2">Update Review</button>
            <button onClick={() => setEditReview(null)} className="bg-gray-500 text-white p-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}