import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { BsCheckCircleFill } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const processOrder = async () => {
      // 1. Fetch the order
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Order not found!");
        return;
      }

      const orderData = docSnap.data();
      setOrder(orderData);

      // 2. Update user profile if logged in
      if (user && orderData.address) {
        try {
          // Reference to user document
          const userRef = doc(db, "users", user.uid);

          // Get current user data
          const userSnap = await getDoc(userRef);

          // Prepare updates
          const updates = {
            lastOrder: serverTimestamp(),
            orderCount: (userSnap.data()?.orderCount || 0) + 1,
            updatedAt: serverTimestamp(),
          };

          // If address doesn't exist or is different, update it
          if (
            !userSnap.data()?.address ||
            userSnap.data()?.address.full !== orderData.address.full
          ) {
            updates.address = orderData.address;
          }

          // Merge updates with existing data
          await setDoc(userRef, updates, { merge: true });

          // Also save address to user's addresses subcollection
          const addressesRef = collection(db, "users", user.uid, "addresses");
          await addDoc(addressesRef, {
            ...orderData.address,
            isDefault: true,
            createdAt: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error updating user profile:", error);
        }
      }
    };

    processOrder();
  }, [orderId, user]);

  const handleBackToHome = () => {
    navigate("/");
  };

  if (!order) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full text-center">
        <div className="flex justify-center mb-6">
          <BsCheckCircleFill size={64} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. You will receive a
          confirmation email shortly.
        </p>

        {order.address && (
          <div className="bg-gray-50 p-4 rounded shadow text-left mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Shipping To:
            </h2>
            <p className="text-gray-700 text-sm">{order.address.full}</p>
            <p className="text-gray-700 text-sm">{order.address.phone}</p>
          </div>
        )}

        <div className="text-gray-800 font-semibold text-lg mb-2">
          Total Paid: ${order.total?.toFixed(2)}
        </div>
        <p className="text-sm text-gray-500">
          We’ll notify you when your package is on the way.
        </p>

        <button
          className="mt-8 px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
