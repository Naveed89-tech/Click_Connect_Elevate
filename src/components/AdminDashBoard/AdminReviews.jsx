import React, { useEffect, useState } from "react";

// Fetch all reviews across products
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const snapshot = await getDocs(collectionGroup(db, "reviews"));

        const reviewList = await Promise.all(
          snapshot.docs.map(async (d) => {
            const pathParts = d.ref.path.split("/");
            const productId = pathParts[1];
            const reviewData = d.data();

            let hasPurchased = false;
            try {
              if (reviewData.userId) {
                // Check both orders collection and any user-specific orders subcollection
                const ordersQuery = query(
                  collection(db, "orders"),
                  where("userId", "==", reviewData.userId)
                );

                // Also check user's orders subcollection if it exists
                const userOrdersQuery = query(
                  collection(db, "users", reviewData.userId, "orders")
                );

                const [ordersSnapshot, userOrdersSnapshot] = await Promise.all([
                  getDocs(ordersQuery),
                  getDocs(userOrdersQuery),
                ]);

                // Check both order locations for the product
                const checkOrders = (snapshot) => {
                  let found = false;
                  snapshot.forEach((orderDoc) => {
                    const orderData = orderDoc.data();
                    if (
                      orderData.items?.some((item) => item.id === productId)
                    ) {
                      found = true;
                    }
                    // Also check for product variants if needed
                    if (
                      orderData.items?.some(
                        (item) => item.productId === productId
                      )
                    ) {
                      found = true;
                    }
                  });
                  return found;
                };

                hasPurchased =
                  checkOrders(ordersSnapshot) ||
                  checkOrders(userOrdersSnapshot);
              }
            } catch (err) {
              console.error("Error checking purchase:", err);
            }

            return {
              id: d.id,
              productId,
              hasPurchased,
              ...reviewData,
              ref: d.ref,
            };
          })
        );

        setReviews(reviewList);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleStatusChange = async (reviewRef, newStatus) => {
    try {
      await updateDoc(reviewRef, {
        status: newStatus,
        lastUpdated: new Date(),
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.ref.id === reviewRef.id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.userName &&
        review.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (review.status
        ? review.status === statusFilter
        : statusFilter === "pending");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Reviews Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and moderate customer product reviews
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search reviews..."
                className="pl-10 pr-4 py-2 border    border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="relative group">
              <select
                className="w-full pl-4 pr-10 py-2 border appearance-none border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="font-Rubik text-gray-400 italic">
                  All Statuses
                </option>
                <option
                  value="approved"
                  className="font-Rubik text-gray-400 italic"
                >
                  Approved
                </option>
                <option
                  value="pending"
                  className="font-Rubik text-gray-400 italic"
                >
                  Pending
                </option>
                <option
                  value="rejected"
                  className="font-Rubik text-gray-400 italic"
                >
                  Rejected
                </option>
              </select>

              {/* Custom Chevron Icon */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No reviews found
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "No reviews have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReviews.map((review) => (
                    <tr
                      key={review.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {review.productId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {review.userName || review.user}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            review.hasPurchased
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {review.hasPurchased ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-sm text-gray-500">
                            ({review.rating}/5)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {review.comment}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                            !review.status || review.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : review.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {review.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        {review.status !== "approved" && (
                          <button
                            onClick={() =>
                              handleStatusChange(review.ref, "approved")
                            }
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                              !review.hasPurchased
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                            disabled={!review.hasPurchased}
                            title={
                              !review.hasPurchased
                                ? "User hasn't purchased this product"
                                : "Approve this review"
                            }
                          >
                            Approve
                          </button>
                        )}
                        {review.status !== "rejected" && (
                          <button
                            onClick={() =>
                              handleStatusChange(review.ref, "rejected")
                            }
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                            title="Reject this review"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
