import React from "react";

import { FaHeart, FaShoppingCart, FaTimes, FaTrashAlt } from "react-icons/fa";

import { useWishlist } from "../../context/WishlistContext";

const WishlistSidebar = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center">
          <FaHeart className="text-red-500 mr-3" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Your Wishlist ({wishlistItems.length})
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-100px)]">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FaHeart className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg">Your wishlist is empty</p>
            <p className="text-sm mt-2">Save your favorite items here!</p>
          </div>
        ) : (
          wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 pb-6 border-b border-gray-100 dark:border-gray-700"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                    {item.name}
                  </h4>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </p>
                  <button className="flex items-center text-xs text-primary hover:text-primary/80 transition-colors">
                    <FaShoppingCart className="mr-1" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {wishlistItems.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900 text-center">
          <button
            onClick={onClose}
            className="text-sm text-primary font-medium py-2 hover:underline"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistSidebar;
