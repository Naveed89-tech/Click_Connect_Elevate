import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaTruck,
  FaBoxOpen,
  FaShieldAlt,
  FaChevronLeft,
} from "react-icons/fa";
import { auth } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import { format, formatDistanceToNow } from "date-fns";
import { updateDoc } from "firebase/firestore";

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
    setIsAddingToCart(true);
    try {
      await addToCart({ ...product, quantity });
      toast.success(`${quantity} ${product.name} added to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 dark:text-white">
      {/* Improved Breadcrumb Navigation */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
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

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <Zoom>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={activeImage}
              className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800  flex items-center justify-center"
            >
              <img
                src={
                  imageError
                    ? placeholderImage
                    : activeImage || placeholderImage
                }
                alt={product.name}
                onError={handleImageError}
                className=" w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
          </Zoom>

          <div className="grid grid-cols-5 gap-2">
            {product.thumbnails?.length > 0 ? (
              product.thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(thumb)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
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

        {/* Enhanced Product Info Section */}
        <div className="space-y-6">
          <div className="border-b pb-4 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-lg ${
                      i < (product.rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({product.reviewCount || 0} reviews) |{" "}
                <span
                  className={`font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </span>
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
              {product.salePrice && (
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                  Save {((1 - actualPrice / product.price) * 100).toFixed(0)}%
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <>
                <div className="flex items-center gap-4 py-2">
                  <div className="w-32">
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
                  <div className="pt-6">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {product.stock} available
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-colors ${
                      isAddingToCart ? "opacity-75 cursor-not-allowed" : ""
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
                    ) : (
                      <>
                        <FaShoppingCart />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className="p-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Add to wishlist"
                  >
                    <FaHeart className="text-red-500" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                      <FaBoxOpen className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        In Stock
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Ships Today
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Tabs Section */}
      <div className="mt-16">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {["description", "reviews", "related"].map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  tab === key
                    ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {key === "reviews" && product.reviewCount > 0 && (
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {product.reviewCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-6">
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
              {/* Only show approved reviews */}
              {liveReviews.length > 0 ? (
                liveReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded p-4 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-white">
                        {review.userName?.[0]?.toUpperCase() || "A"}
                      </div>
                      <span className="font-semibold">
                        {review.userName || "Anonymous"}
                      </span>
                      <div className="flex ml-auto text-yellow-500">
                        {[...Array(5)].map((_, j) => (
                          <FaStar
                            key={j}
                            className={
                              j < (review.rating || 0)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {review.comment || "No comment"}
                    </p>
                    {review.date &&
                      (() => {
                        try {
                          const reviewDate = review.date.toDate
                            ? review.date.toDate()
                            : new Date(review.date);

                          if (isNaN(reviewDate.getTime()))
                            throw new Error("Invalid date");

                          return (
                            <p className="text-xs text-gray-500 mt-2">
                              {format(reviewDate, "dd MMM yyyy, hh:mm a")}{" "}
                              <span className="text-gray-400">
                                (
                                {formatDistanceToNow(reviewDate, {
                                  addSuffix: true,
                                })}
                                )
                              </span>
                            </p>
                          );
                        } catch (err) {
                          console.warn("Bad review date:", review.date);
                          return (
                            <p className="text-xs text-red-500">Invalid date</p>
                          );
                        }
                      })()}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No approved reviews yet.
                </div>
              )}
            </motion.div>
          )}

          {tab === "related" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {product.related?.length > 0 ? (
                product.related.map((item, i) => (
                  <div
                    key={i}
                    className="border p-3 rounded-md bg-white shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded mb-3 flex items-center justify-center">
                      <img
                        src={item.image || placeholderImage}
                        alt={item.name || "Product"}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImage;
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-bold line-clamp-1">
                      {item.name || "Untitled Product"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {item.intro || "No description available"}
                    </p>
                    <p className="text-green-600 font-semibold">
                      ${item.price?.toFixed(2) || "0.00"}
                    </p>
                    {item.id && (
                      <Link to={`/products/${item.id}`}>
                        <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 text-sm">
                          View Product
                        </button>
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No related products found.
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;