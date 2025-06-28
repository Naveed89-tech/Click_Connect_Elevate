import React, { useEffect, useState } from "react";

import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      async (snapshot) => {
        const orderPromises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let userName = "-";

          // Get user name from users collection
          if (data.userId) {
            try {
              const userRef = doc(db, "users", data.userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                userName = userSnap.data().name || "-";
              }
            } catch (err) {
              console.error("Failed to fetch user:", err);
            }
          }

          return {
            id: docSnap.id,
            ...data,
            userName,
          };
        });

        const results = await Promise.all(orderPromises);
        setOrders(results);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Orders Management</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Order ID</th>
            <th className="p-2 text-left">Customer</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Payment</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.userName}</td>
                <td className="p-2">
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString()
                    : "-"}
                </td>
                <td className="p-2">
                  $
                  {order.total?.toFixed(2) ||
                    order.subtotal?.toFixed(2) ||
                    "0.00"}
                </td>
                <td className="p-2">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">
                    {order.status || "Pending"}
                  </span>
                </td>
                <td className="p-2">{order.paymentMethod || "Unknown"}</td>
                <td className="p-2">
                  <button
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
