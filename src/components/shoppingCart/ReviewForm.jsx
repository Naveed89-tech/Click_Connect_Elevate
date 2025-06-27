// ReviewForm.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

const ReviewForm = ({ productId, orderId, onClose }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return toast.error("Please enter your review.");

    const reviewData = {
      userId: user.uid,
      userName: user.displayName || user.email || "Anonymous", // ✅ improved
      rating,
      comment,
      orderId,
      createdAt: serverTimestamp(),
      status: "pending",
    };

    try {
      await addDoc(
        collection(db, "products", productId, "reviews"),
        reviewData
      );
      toast.success("✅ Review submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Review error:", error);
      toast.error("❌ Failed to submit review.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">Leave a Review</h2>

        <label className="block mb-2 text-sm">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-full border rounded p-2 mb-4"
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>
              {star} Star{star > 1 && "s"}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Share your experience..."
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
