import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFirestoreProducts from "../../hooks/useFirestoreProducts";
import Button from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function CategoryPage() {
  const location = useLocation();
  const allProducts = useFirestoreProducts();

  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");

  const itemsPerPage = 9;

  // 🧠 Get current category from URL path
  const path = location.pathname.split("/").filter(Boolean).pop(); // e.g., "smartHome"

  // 🔥 Filter products by category from Firestore
  useEffect(() => {
    if (Array.isArray(allProducts)) {
      const filtered = allProducts.filter(
        (p) =>
          p.category?.toLowerCase().replace(/\s+/g, "") ===
          path.toLowerCase().replace(/\s+/g, "")
      );
      setProducts(filtered);
    }
  }, [allProducts, path]);

  // 🔎 Apply filters
  let filteredProducts = products.filter((product) => {
    const matchPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchSeller =
      selectedSellers.length === 0 || selectedSellers.includes(product.seller);
    const matchFeature =
      selectedFeatures.length === 0 ||
      selectedFeatures.every((f) => product.features.includes(f));
    return matchPrice && matchSeller && matchFeature;
  });

  // 🔃 Sort
  const sortedProducts = [...filteredProducts];
  if (sortOption === "price-asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">
            Total Products: {filteredProducts.length}
          </span>
          <select
            className="border px-3 py-1 rounded text-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex flex-col"
              >
                <div className="h-48 mb-4 overflow-hidden rounded">
                  <img
                    src={product.images[0] || "https://via.placeholder.com/400"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-auto text-green-600 font-semibold">
                  ${product.price}
                </p>
                <Link to={`/product/${product.id}`}>
                  <Button className="w-full mt-2">Shop Now</Button>
                </Link>
              </div>
            ))
          ) : (
            <p>No products found for this category.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft />
          </Button>
          {[...Array(totalPages).keys()].map((n) => (
            <Button
              key={n}
              variant={n + 1 === currentPage ? "outline" : "ghost"}
              className={n + 1 === currentPage ? "bg-gray-200" : ""}
              size="sm"
              onClick={() => setCurrentPage(n + 1)}
            >
              {n + 1}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <ChevronRight />
          </Button>
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;
