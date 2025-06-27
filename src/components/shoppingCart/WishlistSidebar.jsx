import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import { FaTimes, FaTrashAlt } from "react-icons/fa";

const WishlistSidebar = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold">Your Wishlist</h2>
        <FaTimes onClick={onClose} className="cursor-pointer" />
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-100px)]">
        {wishlistItems.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty.</p>
        ) : (
          wishlistItems.map((item) => (
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
                <p className="text-sm text-gray-500">${item.price}</p>
              </div>
              <FaTrashAlt
                onClick={() => removeFromWishlist(item.id)}
                className="cursor-pointer text-red-500"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishlistSidebar;
