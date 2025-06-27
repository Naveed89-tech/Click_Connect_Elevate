import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import ReviewForm from "../../components/shoppingCart/ReviewForm"; // ✅ adjust if path differs

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewProductId, setReviewProductId] = useState(null);
  const [reviewOrderId, setReviewOrderId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    });

    return () => unsubscribe();
  }, [user]);

  const openReviewForm = (productId, orderId) => {
    setReviewProductId(productId);
    setReviewOrderId(orderId);
    setShowReviewForm(true);
  };

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Placed on:{" "}
                  {new Date(order.createdAt?.toDate()).toLocaleString()}
                </span>
                <span className="text-sm font-semibold capitalize text-blue-600">
                  Status: {order.status}
                </span>
              </div>
              <ul className="text-sm text-gray-700 mb-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <div>
                      {item.name} × {item.quantity}
                      <br />
                      {order.status === "delivered" && (
                        <button
                          onClick={() => openReviewForm(item.id, order.id)}
                          className="text-xs text-blue-600 underline hover:text-blue-800 mt-1"
                        >
                          Leave Review
                        </button>
                      )}
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="text-right text-sm font-bold">
                Total: ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {showReviewForm && (
        <ReviewForm
          productId={reviewProductId}
          orderId={reviewOrderId}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
};

export default MyOrders;
