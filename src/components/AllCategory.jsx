// ✅ SmartHomePage still re-uses Catalog filter logic
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X as Close,
  Filter as FilterIcon,
  Grid as ViewAllIcon,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import useFirestoreProducts from "../hooks/useFirestoreProducts";
import Button from "./ui/button";
import ProductCard from "./ui/ProductCard";

function AllCategory() {
  /* ──────────── State & hooks ──────────── */
  const location = useLocation();
  const allProducts = useFirestoreProducts();
  const categorySlug = location.pathname.split("/").filter(Boolean).pop();
  const catalogPage = categorySlug === "products";
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCompanys, setSelectedCompanys] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  const [featureSearch, setFeatureSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // mobile drawer
  const [showAll, setShowAll] = useState(catalogPage);

  const itemsPerPage = 9;

  /* ───────────── Helpers ───────────── */
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/[_\s]+/g, "-")
      .replace(/([a-z])([A-Z])/g, "$1-$2");

  // ⬇︎ only change: if showAll → skip category filter
  const products =
    showAll || catalogPage
      ? allProducts
      : allProducts.filter((p) => normalize(p.category) === categorySlug);

  const allCompanies = [...new Set(products.map((p) => p.company))].filter(
    Boolean
  );
  const allFeatures = [...new Set(products.flatMap((p) => p.features || []))];

  /* ───────── Filter chain unchanged ───────── */
  const filteredProducts = products.filter((p) => {
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchCompany =
      selectedCompanys.length === 0 || selectedCompanys.includes(p.company);
    const matchFeature =
      selectedFeatures.length === 0 ||
      selectedFeatures.every((f) => p.features?.includes(f));
    return matchPrice && matchCompany && matchFeature;
  });

  const sortedProducts = [...filteredProducts];
  if (sortOption === "price-asc")
    sortedProducts.sort((a, b) => a.price - b.price);
  if (sortOption === "price-desc")
    sortedProducts.sort((a, b) => b.price - a.price);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  /* ───────── Toggle helpers (unchanged) ───────── */
  const toggleCompany = (c) =>
    setSelectedCompanys((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  const toggleFeature = (f) =>
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  const clearFilters = () => {
    setSelectedCompanys([]);
    setSelectedFeatures([]);
    setCompanySearch("");
    setFeatureSearch("");
    setPriceRange([0, 2000]);
    setCurrentPage(1);
  };

  /* ───────── Breadcrumbs (unchanged) ───────── */
  const labelOverrides = {
    products: "Catalog",
    "smart-home": "Smart Home",
    wearables: "Wearables",
    "smart-city": "Smart City",
  };
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "Home", to: "/" },
    ...pathSegments.map((seg, i) => ({
      label: labelOverrides[seg] || seg,
      to: "/" + pathSegments.slice(0, i + 1).join("/"),
      disabled: i === pathSegments.length - 1,
    })),
  ];

  /* ───────── Filters panel reused both places ───────── */
  const filtersContent = (
    <>
      {/* Price */}
      <div>
        <div className="font-semibold mb-1">Price</div>
        <div className="flex gap-2">
          <input
            type="number"
            className="border rounded px-2 py-1 w-full"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
          />
          <input
            type="number"
            className="border rounded px-2 py-1 w-full"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <div className="font-semibold mb-1">Company</div>
        <input
          type="text"
          className="border px-2 py-1 w-full rounded"
          placeholder="Search"
          value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
        />
        <div className="mt-2 space-y-1 max-h-40 overflow-y-auto pr-1">
          {allCompanies
            .filter((c) =>
              c.toLowerCase().includes(companySearch.toLowerCase())
            )
            .map((c) => (
              <label key={c} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={selectedCompanys.includes(c)}
                  onChange={() => toggleCompany(c)}
                />
                <span>{c}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="font-semibold mb-1">Product Features</div>
        <input
          type="text"
          className="border px-2 py-1 w-full rounded"
          placeholder="Search"
          value={featureSearch}
          onChange={(e) => setFeatureSearch(e.target.value)}
        />
        <div className="mt-2 space-y-1 max-h-40 overflow-y-auto pr-1">
          {allFeatures
            .filter((f) =>
              f.toLowerCase().includes(featureSearch.toLowerCase())
            )
            .map((f) => (
              <label key={f} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(f)}
                  onChange={() => toggleFeature(f)}
                />
                <span>{f}</span>
              </label>
            ))}
        </div>
      </div>

      <Button variant="secondary" onClick={clearFilters} className="w-full">
        Clear Filters
      </Button>
    </>
  );

  /* ───────── JSX ───────── */
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{labelOverrides[categorySlug] || categorySlug}</title>
      </Helmet>

      {/* Mobile top bar: Show-all + Filters */}
      <div className="lg:hidden p-4 flex justify-between">
        <Button
          variant={showAll ? "default" : "outline"}
          className="!hidden  !sm:flex  items-center gap-2"
          onClick={() => setShowAll((prev) => !prev)}
        >
          <ViewAllIcon size={18} />
          {showAll ? "Back to Category" : "Show All"}
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsFilterOpen(true)}
        >
          <FilterIcon size={18} /> Filters
        </Button>
      </div>

      {/* Drawer overlay (mobile) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="bg-white h-full w-11/12 max-w-xs p-6 overflow-y-auto space-y-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Close size={20} />
              </button>
            </div>
            {filtersContent}
          </div>
          <div
            className="flex-grow bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
        </div>
      )}

      <main className="p-6">
        {/* Breadcrumbs */}
        <div className="mb-4 text-sm text-gray-600 flex gap-2 flex-wrap">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center">
              {crumb.disabled ? (
                <span>{crumb.label}</span>
              ) : (
                <Link to={crumb.to} className="text-blue-500 hover:underline">
                  {crumb.label}
                </Link>
              )}
              {idx < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
            </span>
          ))}
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Show-all button for desktop */}
            <Button
              variant={showAll ? "default" : "outline"}
              className="w-full flex items-center justify-center gap-2 mb-4"
              onClick={() => setShowAll((prev) => !prev)}
            >
              <ViewAllIcon size={18} />{" "}
              {showAll ? "Back to Category" : "Show All"}
            </Button>
            {filtersContent}
          </aside>

          {/* Product grid */}
          <section className="lg:col-span-9">
            <div className="flex justify-between mb-4 items-center">
              <span>
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border px-3 py-1 rounded"
              >
                <option value="">Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {paginatedProducts.length === 0 ? (
              <p>No products found. Try different filters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </Button>
              {[...Array(totalPages)].map((_, idx) => (
                <Button
                  key={idx}
                  variant={idx + 1 === currentPage ? "active" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
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

export default AllCategory;
