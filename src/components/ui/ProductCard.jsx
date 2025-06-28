import React from "react";
import { Link } from "react-router-dom";
import Button from "./button";

const ProductCard = ({ product }) => {
  const getImageUrl = () => {
    if (product.imageUrl) return product.imageUrl;
    if (Array.isArray(product.images) && product.images.length > 0)
      return product.images[0];
    return "https://via.placeholder.com/400x300?text=No+Image";
  };

  return (
    <div className="relative bg-white w-full max-w-sm mx-auto rounded-xl shadow transition-transform transform hover:-translate-y-1 hover:shadow-lg duration-300 flex flex-col h-full font-Rubik">
      {/* Product Image */}
      <div className="w-full h-auto sm:h-[300px] bg-gray-100 overflow-hidden rounded-t-xl">
        <img
          src={getImageUrl()}
          alt={product.name || "Product image"}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col sm:flex-grow justify-center">
        {/* TITLE - fixed height */}
        <h3 className="text-sm sm:text-[16px] md:text-[18px] font-semibold text-gray-900 sm:leading-6 sm:mb-2 line-clamp-2 min-h-[48px]">
          {product.name || "Unnamed Product"}
        </h3>

        {/* INTRODUCTION - fixed height */}
        <h4 className="text-[12px] sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-2 sm:min-h-[80px]">
          {product.introduction || "Smart device with key features."}
        </h4>

        {/* COMPANY */}
        <h3 className="text-[12px] font-semibold text-primary mb-3">
          {product.company || "Generic"}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3 sm:w-4 sm:h-4 h-4 ${
                  star <= (product.rating ?? 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
            ({product.reviewCount ?? 0} reviews)
          </span>
        </div>

        {/* PRICE */}
        <p className="text-md font-medium text-green-600 mb-4 mt-auto">
          ${parseFloat(product.price || 0).toFixed(2)}
        </p>

        {/* CTA */}
        <Link to={`/product/${product.id}`} className="mt-auto">
          <Button variant="cardButton" className="w-full">
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
