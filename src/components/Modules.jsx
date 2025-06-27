import React, { useState, useEffect } from "react";

import Card, { CardContent } from "./ui/card";
import Button from "./ui/button";
import { ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Input from "./ui/input";
import Slider from "./ui/slider";
import Checkbox from "./ui/checkbox";
import Header from "./header/index";
import Footer from "./home/Footer";
import { useParams, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const mockProducts = new Array(20).fill(null).map((_, index) => ({
  id: index + 1,
  name: `Smart Thermostat ${index + 1} - WiFi Enabled`,
  price: 199 + index * 20,
  image: `https://via.placeholder.com/400x300?text=SmartHome+Device+${
    index + 1
  }`,
  seller: ["Nest", "Ecobee", "Amazon", "Walmart", "Honeywell"][index % 5],
  features:
    index % 2 === 0
      ? ["Voice Control", "Energy Saving"]
      : ["App Control", "Alexa Compatible"],
}));

function Modules() {
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sellerSearch, setSellerSearch] = useState("");
  const [featureSearch, setFeatureSearch] = useState("");
  const [sortOption, setSortOption] = useState("");

  const itemsPerPage = 9;

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const toggleSeller = (seller) => {
    setSelectedSellers((prev) =>
      prev.includes(seller)
        ? prev.filter((s) => s !== seller)
        : [...prev, seller]
    );
    setCurrentPage(1);
  };

  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedSellers([]);
    setSelectedFeatures([]);
    setPriceRange([0, 1000]);
    setSellerSearch("");
    setFeatureSearch("");
    setCurrentPage(1);
  };

  let filteredProducts = products.filter((product) => {
    const matchPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchSeller =
      selectedSellers.length === 0 || selectedSellers.includes(product.seller);
    const matchFeature =
      selectedFeatures.length === 0 ||
      selectedFeatures.every((feature) => product.features.includes(feature));
    return matchPrice && matchSeller && matchFeature;
  });

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
  const location = useLocation();

  const formatTitle = (slug) =>
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const labelOverrides = {
    products: "Catalog",
    "smart-home": "Smart Home",
    wearables: "Wearables",
    "smart-city": "Smart City",
  };
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    return {
      label: labelOverrides[segment] || formatTitle(segment),
      to: path,
      disabled: index === pathSegments.length - 1,
    };
  });
  breadcrumbs.unshift({ label: "Home", to: "/" });

  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.label,
          ...(crumb.to && !crumb.disabled
            ? { item: `${window.location.origin}${crumb.to}` }
            : {}),
        })),
      })}
    </script>
  </Helmet>;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        <div className="mb-6 text-sm font-Montserrat text-secondary flex flex-wrap gap-1">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1">
              {!crumb.disabled ? (
                <Link to={crumb.to} className="hover:text-blue-500">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-500 cursor-default">
                  {crumb.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="text-gray-400">&gt;</span>
              )}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Filters */}
          <aside className="col-span-3 space-y-6 sticky top-6 self-start">
            <div>
              <div className="flex justify-between items-center font-semibold">
                <span>Price ({products.length})</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([+e.target.value, priceRange[1]])
                  }
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], +e.target.value])
                  }
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center font-semibold">
                <span>Seller</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center border px-2 mt-2 rounded">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  value={sellerSearch}
                  onChange={(e) => setSellerSearch(e.target.value)}
                  className="w-full py-1 focus:outline-none"
                />
              </div>
              <div className="mt-2 space-y-2">
                {["Apple Store", "Best Buy", "Amazon", "Walmart", "Target"]
                  .filter((name) =>
                    name.toLowerCase().includes(sellerSearch.toLowerCase())
                  )
                  .map((name) => (
                    <div key={name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSellers.includes(name)}
                        onChange={() => toggleSeller(name)}
                      />
                      <span>{name}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center font-semibold">
                <span>Product Feature</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center border px-2 mt-2 rounded">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  className="w-full py-1 focus:outline-none"
                />
              </div>
              <div className="mt-2 space-y-2">
                {[
                  "Face ID",
                  "Triple Camera",
                  "5G",
                  "A17 Chip",
                  "Super Retina XDR Display",
                ]
                  .filter((feature) =>
                    feature.toLowerCase().includes(featureSearch.toLowerCase())
                  )
                  .map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
              </div>
            </div>

            <Button className="w-full mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </aside>

          {/* Products Display */}
          <section className="col-span-9">
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
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white p-4 rounded-xl shadow hover:shadow-md transition flex flex-col h-full product_card"
                >
                  {/* Heart Icon */}
                  <button
                    className="absolute top-3 right-3 z-10"
                    onClick={() => console.log("Toggle favorite", product.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>

                  {/* Image */}
                  <div className="relative h-48 mb-4 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <h4 className="text-[16px] text-gray-500 mb-4 line-clamp-2">
                      {product.intro || "Latest iPhone with Pro features"}
                    </h4>
                    <h3 className="text-[12px] font-semibold text-gray-500 mb-3">
                      {product.seller}
                    </h3>

                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (product.rating || 4)
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
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviewCount || 12} reviews)
                      </span>
                    </div>

                    <p className="text-md font-medium text-green-600 mb-3 mt-auto">
                      ${product.price}
                    </p>
                  </div>

                  {/* Buy Now */}
                  <Link to={`/product/${product.id}`}>
                    <Button variant="cardButton">Shop Now</Button>
                  </Link>
                </div>
              ))}
            </div>

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
          </section>
        </div>
      </main>
    </div>
  );
}

export default Modules;
