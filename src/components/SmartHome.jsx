// ✅ SmartHomePage now uses consistent filter logic with Catalog.jsx

import React, { useState, useEffect } from "react";
import { ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import useFirestoreProducts from "../hooks/useFirestoreProducts";
import Button from "./ui/button";
import ProductCard from "./ui/ProductCard";

function SmartHomePage() {
  const location = useLocation();
  const allProducts = useFirestoreProducts();
  const categorySlug = location.pathname.split("/").filter(Boolean).pop();

  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCompanys, setSelectedCompanys] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  const [featureSearch, setFeatureSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/[_\s]+/g, "-")
      .replace(/([a-z])([A-Z])/g, "$1-$2");

  const products = allProducts.filter(
    (product) => normalize(product.category) === categorySlug
  );

  const allCompanies = [...new Set(products.map((p) => p.company))].filter(
    Boolean
  );
  const allFeatures = [...new Set(products.flatMap((p) => p.features || []))];

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

  const toggleCompany = (company) => {
    setSelectedCompanys((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
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
    setSelectedCompanys([]);
    setSelectedFeatures([]);
    setCompanySearch("");
    setFeatureSearch("");
    setPriceRange([0, 2000]);
    setCurrentPage(1);
  };

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
      label: labelOverrides[segment] || segment,
      to: path,
      disabled: index === pathSegments.length - 1,
    };
  });
  breadcrumbs.unshift({ label: "Home", to: "/" });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{labelOverrides[categorySlug] || categorySlug}</title>
      </Helmet>

      <main className="p-6">
        <div className="mb-4 text-sm text-gray-600 flex gap-2">
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

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-3 space-y-6">
            <div>
              <div className="font-semibold mb-1">Price</div>
              <div className="flex gap-2">
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
              <div className="font-semibold mb-1">Company</div>
              <input
                type="text"
                className="border px-2 py-1 w-full rounded"
                placeholder="Search"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
              />
              <div className="mt-2 space-y-1">
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

            <div>
              <div className="font-semibold mb-1">Product Features</div>
              <input
                type="text"
                className="border px-2 py-1 w-full rounded"
                placeholder="Search"
                value={featureSearch}
                onChange={(e) => setFeatureSearch(e.target.value)}
              />
              <div className="mt-2 space-y-1">
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

            <Button onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </aside>

          <section className="col-span-9">
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

            <div className="flex justify-center items-center gap-2 mt-6">
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
                  variant={idx + 1 === currentPage ? "default" : "ghost"}
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

export default SmartHomePage;
