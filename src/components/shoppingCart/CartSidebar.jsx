// CartSidebar.jsx — discounted-price aware
import React from "react";
import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

/* helper: the number we actually charge for ONE unit */
const getUnitPrice = (item) => item.unitPrice ?? item.salePrice ?? item.price;

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();
  const { setCartItems, setCartSubtotal } = useCheckout();
  const navigate = useNavigate();

  // ░░░ totals ░░░
  const subtotal = cartItems.reduce(
    (sum, item) => sum + getUnitPrice(item) * item.quantity,
    0
  );

  const handleProceedToCheckout = () => {
    setCartItems(cartItems);
    setCartSubtotal(subtotal);
    onClose();
    navigate("/checkout");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* header */}
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <FaTimes onClick={onClose} className="cursor-pointer" />
      </div>

      {/* items */}
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-200px)]">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold">{item.name}</h4>

                {/* 👇 now shows discounted / unit price */}
                <p className="text-sm text-gray-500">
                  ${getUnitPrice(item).toFixed(2)}
                </p>

                <div className="flex items-center mt-2 gap-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              <FaTrashAlt
                onClick={() => removeFromCart(item.id)}
                className="cursor-pointer text-red-500"
              />
            </div>
          ))
        )}
      </div>

      {/* summary */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex justify-between mb-4 text-lg font-semibold">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {cartItems.length > 0 ? (
          <button
            onClick={handleProceedToCheckout}
            className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </button>
        ) : (
          <button
            disabled
            className="block w-full bg-gray-400 text-white text-center py-2 rounded cursor-not-allowed"
          >
            Cart is Empty
          </button>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
