import "react-medium-image-zoom/dist/styles.css";

import React, { useEffect, useState } from "react";

import { format } from "date-fns";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaBoxOpen,
  FaHeart,
  FaRegStar,
  FaShieldAlt,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaTruck,
} from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import Zoom from "react-medium-image-zoom";
import { Link, useParams } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { db } from "../../firebase";
import Button from "../ui/button";
import RelatedProducts from "./RelatedProducts";

const SingleProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [liveReviews, setLiveReviews] = useState([]);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          const productData = {
            ...data,
            id: snap.id,
            thumbnails: data.images || [],
            related: data.related || [],
          };

          setProduct(productData);
          setActiveImage(data.images?.[0] || "");

          // Load reviews from subcollection - only approved reviews
          const reviewsRef = collection(db, "products", snap.id, "reviews");
          const q = query(
            reviewsRef,
            orderBy("createdAt", "desc"),
            where("status", "==", "approved")
          );

          const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setLiveReviews(fetched);

            // Calculate average rating from approved reviews only
            if (fetched.length > 0) {
              const avg =
                fetched.reduce((sum, r) => sum + (r.rating || 0), 0) /
                fetched.length;

              // ✅ Update local product state
              setProduct((prev) => ({
                ...prev,
                rating: avg,
                reviewCount: fetched.length,
              }));

              // ✅ Persist to Firestore
              const productDocRef = doc(db, "products", snap.id);
              updateDoc(productDocRef, {
                rating: avg,
                reviewCount: fetched.length,
              }).catch((err) => {
                console.error("Failed to update rating in Firestore:", err);
              });
            }
          });

          return unsubscribe;
        } else {
          toast.error("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = fetchProduct();

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [id]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(
      1,
      Math.min(product?.stock || 10, Number(e.target.value))
    );
    setQuantity(isNaN(value) ? 1 : value);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    setIsAddingToCart(true);
    try {
      // 🔒 atomically decrement stock
      const productRef = doc(db, "products", product.id);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(productRef);
        if (!snap.exists()) throw new Error("Product no longer exists");

        const current = snap.data().stock ?? 0;
        if (current < quantity) throw new Error("Not enough stock available");

        tx.update(productRef, { stock: current - quantity });
      });

      // build cart item (was missing)
      const THIRTY_MIN = 30 * 60 * 1000; // 30 minutes

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        unitPrice: product.salePrice || product.price,
        image:
          product.image ||
          product.imageUrl ||
          product.images?.[0] ||
          "/fallback.jpg",
        quantity,
        reservedUntil: Date.now() + THIRTY_MIN,
      };

      await addToCart(cartItem);
      toast.success(`${quantity} ${product.name} added to cart`);

      // local UI update
      setProduct((prev) => ({ ...prev, stock: prev.stock - quantity }));
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    try {
      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image:
          product.image ||
          product.imageUrl ||
          product.thumbnail ||
          product.images?.[0] ||
          "/placeholder.jpg",
      };

      await addToWishlist(wishlistItem);
      toast.success("Added to wishlist");
    } catch (error) {
      toast.error("Failed to add to wishlist");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center">
        <div className="animate-pulse flex justify-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
        <p>Loading product details...</p>
      </div>
    );

  if (!product)
    return (
      <div className="p-10 text-center text-red-500">
        <p>No product found.</p>
        <Link
          to="/products"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Browse Products
        </Link>
      </div>
    );

  const actualPrice = product.salePrice || product.price;
  const placeholderImage = "https://via.placeholder.com/600x400?text=No+Image";

  // Render star rating with half stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 dark:text-white">
      {/* Enhanced Breadcrumb with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/products"
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
        >
          <IoMdArrowRoundBack className="mr-2" />
          Back to Products
        </Link>

        <nav className="hidden md:flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <Link
                  to="/products"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  Products
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Gallery Section */}
        <div className="space-y-4">
          <div className="relative group">
            <Zoom>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={activeImage}
                className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center "
              >
                <img
                  src={
                    imageError
                      ? placeholderImage
                      : activeImage || placeholderImage
                  }
                  alt={product.name}
                  onError={handleImageError}
                  className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </motion.div>
            </Zoom>

            {/* Sale Badge */}
            {product.salePrice && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {((1 - actualPrice / product.price) * 100).toFixed(0)}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-5 gap-3">
            {product.thumbnails?.length > 0 ? (
              product.thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(thumb)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === thumb
                      ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <img
                    src={thumb || placeholderImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                    className="w-full h-full object-cover"
                    alt={`Thumbnail ${idx + 1}`}
                  />
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-4 text-gray-500 text-sm">
                No additional images available
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center">
                {renderStars(product.rating || 0)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.reviewCount || 0} reviews
              </span>
              <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
              {product.sku && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                  SKU: {product.sku}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              {product.shortDescription ||
                product.introduction?.substring(0, 200) + "..."}
            </p>

            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${actualPrice.toFixed(2)}
              </p>
              {product.salePrice && product.price && (
                <p className="text-lg text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>

            {product.stock > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-2 w-full">
                  <div className="w-full sm:w-40">
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-full sm:w-auto pt-2 sm:pt-6">
                    <span
                      className={`text-sm ${
                        product.stock < 10
                          ? "text-orange-500 dark:text-orange-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {product.stock} available
                      {product.stock < 10 &&
                        product.stock > 0 &&
                        " (Low stock)"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
                  <Button
                    variant="secondary"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stock <= 0}
                    className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-colors ${
                      isAddingToCart ? "opacity-75 cursor-not-allowed" : ""
                    } ${
                      product.stock <= 0
                        ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isAddingToCart ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Adding...
                      </>
                    ) : product.stock <= 0 ? (
                      "Out of Stock"
                    ) : (
                      <>
                        <FaShoppingCart />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddToWishlist}
                    className="w-full sm:w-auto p-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                    title="Add to wishlist"
                  >
                    <FaHeart className="text-red-500" />
                  </Button>
                </div>

                {/* Product Highlights - Made full width */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 w-full">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <FaTruck className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Free Delivery
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        1-2 days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                      <FaBoxOpen className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Easy Returns
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        30 Days Policy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <FaShieldAlt className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Warranty
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        1 Year
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full py-4">
                <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="w-full text-red-600 dark:text-red-400 font-medium text-center">
                    This product is currently out of stock
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
                  <Button variant="outline" className="w-full" disabled={true}>
                    Out of Stock
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddToWishlist}
                    className="w-full sm:w-auto p-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                    title="Add to wishlist"
                  >
                    <FaHeart className="text-red-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className="mt-16">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px space-x-8">
            {["description", "reviews", "related"].map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  tab === key
                    ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {key === "reviews" && product.reviewCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {product.reviewCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {tab === "description" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose dark:prose-invert max-w-none"
            >
              {product.description ? (
                <div
                  className="text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="text-gray-500 italic">No description available</p>
              )}
            </motion.div>
          )}

          {tab === "reviews" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {liveReviews.length > 0 ? (
                liveReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-200">
                        {review.userName?.[0]?.toUpperCase() || "A"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {review.userName || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, j) => (
                            <FaStar
                              key={j}
                              className={
                                j < (review.rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }
                              size={14}
                            />
                          ))}
                        </div>
                      </div>
                      {review.date && (
                        <span className="text-xs text-gray-500">
                          {(() => {
                            try {
                              const reviewDate = review.date.toDate
                                ? review.date.toDate()
                                : new Date(review.date);

                              if (isNaN(reviewDate.getTime()))
                                throw new Error("Invalid date");

                              return format(reviewDate, "MMM d, yyyy");
                            } catch (err) {
                              return "Invalid date";
                            }
                          })()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {review.comment || "No comment"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <FaStar className="mx-auto text-gray-300 text-4xl mb-3" />
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    No reviews yet
                  </h4>
                  <p className="text-gray-500 mt-1">
                    Be the first to review this product
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {tab === "related" && <RelatedProducts currentProduct={product} />}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
