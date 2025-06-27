import React, { useEffect } from "react";
import { useCheckout } from "../../context/CheckoutContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { db } from "../../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const PaymentMethod = ({ onBack }) => {
  const {
    address,
    setAddress, // 🔑 Must be available in CheckoutContext
    shippingCost,
    total,
    cartItems,
    cartSubtotal,
  } = useCheckout();

  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  // ✅ Auto-fetch user address if not already loaded
  useEffect(() => {
    const fetchAddress = async () => {
      if (!user || address?.full) return;

      try {
        const ref = collection(db, "users", user.uid, "addresses");
        const snap = await getDocs(ref);
        const addresses = [];
        snap.forEach((doc) => addresses.push({ id: doc.id, ...doc.data() }));

        const primary =
          addresses.find((a) => a.label?.toLowerCase() === "primary") ||
          addresses[0];
        if (primary) {
          setAddress(primary); // inject into context
        }
      } catch (err) {
        console.error("❌ Failed to fetch address:", err);
      }
    };

    fetchAddress();
  }, [user, address, setAddress]);

  const handleConfirmOrder = async () => {
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    const fullAddress =
      address?.full ||
      [
        address?.street,
        address?.city,
        address?.state,
        address?.postalCode,
        address?.country,
      ]
        .filter(Boolean)
        .join(", ");

    if (!address || !fullAddress) {
      alert("Please provide a complete shipping address.");
      return;
    }

    const orderData = {
      userId: user.uid,
      items: cartItems,
      address: {
        ...address,
        full: fullAddress,
      },
      shippingCost,
      subtotal: cartSubtotal,
      total,
      paymentMethod: "Cash on Delivery",
      status: "pending",
      markedBy: "user",
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      clearCart();
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("❌ Failed to place order.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Summary Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {address && (
            <div className="text-sm text-gray-700 mt-6">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="mb-1">{address.full}</p>
              {address.street && <p className="mb-1">{address.street}</p>}
              <p className="mb-1">
                {address.city && `${address.city}, `}
                {address.state && `${address.state} `}
                {address.postalCode}
              </p>
              {address.country && <p className="mb-1">{address.country}</p>}
              <p className="mt-2">
                <span className="font-medium">Phone:</span> {address.phone}
              </p>
            </div>
          )}

          <div className="border-t pt-4 mt-4 text-gray-800 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Payment</h2>
          <div className="border rounded-lg p-6 bg-gray-100 text-center text-gray-800">
            <p className="text-xl font-semibold mb-2">Cash on Delivery</p>
            <p className="text-sm text-gray-600">
              You'll pay when the package is delivered to your address.
            </p>
          </div>

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="billing"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="billing" className="text-sm">
              Same as billing address
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-10">
            <button
              className="px-6 py-2 border rounded hover:bg-gray-100"
              onClick={onBack}
            >
              Back
            </button>
            <button
              className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
              onClick={handleConfirmOrder}
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
