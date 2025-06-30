// CartSidebar.jsx — discounted-price aware
import React from "react";

import { FaChevronRight, FaTimes, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";

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
      className={`fixed top-0 font-Roboto right-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* header */}
      <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Your Shopping Cart ({cartItems.length})
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>

      {/* items */}
      <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-220px)]">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-lg">Your cart is empty</p>
            <p className="text-sm mt-2">Start adding some items!</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 pb-6 border-b border-gray-100 dark:border-gray-700"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                />
                {item.quantity > 1 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {item.quantity}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                    {item.name}
                  </h4>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>

                {/* Price display */}
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  ${getUnitPrice(item).toFixed(2)}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center mt-3 gap-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-2 text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* summary */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {cartItems.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
            Shipping & taxes calculated at checkout
          </div>
        )}

        {cartItems.length > 0 ? (
          <button
            onClick={handleProceedToCheckout}
            className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Proceed to Checkout
            <FaChevronRight className="ml-2 text-sm" />
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
          >
            Cart is Empty
          </button>
        )}

        {cartItems.length > 0 && (
          <button
            onClick={onClose}
            className="mt-3 text-sm text-primary font-medium w-full py-2 hover:underline"
          >
            Continue Shopping
          </button>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;