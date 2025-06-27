import React, { useState } from "react";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import mainImage from "../../assets/images/product.jpg";
import thumb1 from "../../assets/images/product-thumb1.jpg";
import thumb2 from "../../assets/images/product-thumb2.jpg";
import thumb3 from "../../assets/images/product-thumb3.jpg";
import related1 from "../../assets/images/related1.jpg";
import related2 from "../../assets/images/related2.jpg";
import related3 from "../../assets/images/related3.jpg";
const ProductDetails = ({ product = ProductDetails.defaultProps.product }) => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
    alert(`${product.name} added to cart!`);
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="flex flex-col items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded shadow"
          />
          <div className="mt-4 flex gap-2">
            {product.thumbnails.map((thumb, idx) => (
              <img
                key={idx}
                src={thumb}
                alt="thumb"
                className="w-16 h-16 rounded border"
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(product.rating)].map((_, i) => (
              <FaStar key={i} />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              ({product.reviews.length} Reviews)
            </span>
          </div>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-semibold text-green-600">
            ${product.price}
          </p>
          <p className="text-sm text-gray-600">
            {product.stock > 0 ? "Stock Available" : "Out of Stock"}
          </p>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="inline mr-2" /> Add to Cart
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              <FaHeart className="inline mr-1 text-red-500" /> Wishlist
            </button>
          </div>

          {/* Reviews */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>
            <div className="space-y-2">
              {product.reviews.map((review, idx) => (
                <div key={idx} className="border p-3 rounded bg-white">
                  <p className="font-semibold">{review.user}</p>
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Items */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Related Items</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {product.related.map((item, idx) => (
                <div key={idx} className="border p-2 rounded">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="text-sm mt-1">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Sample product prop for testing
ProductDetails.defaultProps = {
  product: {
    name: "Smart Home Device X",
    image: mainImage,
    thumbnails: [thumb1, thumb2, thumb3],
    description:
      "This Smart Home Device X helps you control your appliances from anywhere using your smartphone. Compatible with Alexa and Google Assistant.",
    price: 129.99,
    stock: 12,
    rating: 5,
    reviews: [
      { user: "Ali", rating: 5, comment: "Excellent product!" },
      {
        user: "Sara",
        rating: 4,
        comment: "Works well, but setup was a bit tricky.",
      },
    ],
    related: [
      { name: "Smart Plug Mini", image: related1 },
      { name: "Smart Light Bulb", image: related2 },
      { name: "Wi-Fi Thermostat", image: related3 },
    ],
  },
};

export default ProductDetails;
