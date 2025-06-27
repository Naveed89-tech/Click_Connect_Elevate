import React, { useState, useEffect } from "react";
import { ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import useFirestoreProducts from "../hooks/useFirestoreProducts";
import Button from "./ui/button";
import { updateDoc, getDocs } from "firebase/firestore";
import ProductCard from "./ui/ProductCard";

function Catalog() {
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCompanys, setSelectedCompanys] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [CompanySearch, setCompanySearch] = useState("");
  const [featureSearch, setFeatureSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 9;
  const allProducts = useFirestoreProducts();

  useEffect(() => {
    if (allProducts) {
      console.log("Raw products data from Firebase:", allProducts); // Debug line
      const transformedProducts = allProducts.map((product) => ({
        id: product.id || Math.random().toString(36).substring(2, 9),
        name: product.name || "Unnamed Product",
        price: product.price || 0,
        imageUrl:
          product.images?.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/400x300?text=No+Image",
        company: product.company || "Generic Company",

        features: product.features || ["Standard Feature"],
        rating: product.rating ?? 0,
        reviewCount: product.reviewCount ?? 0,
        introduction: product.introduction
          ? product.introduction.substring(0, 200) + "..."
          : "Product description not available",
      }));

      setProducts(transformedProducts);
      setLoading(false);
    }
  }, [allProducts]);

  const toggleCompany = (company) => {
    setSelectedCompanys((prev) =>
      prev.includes(company)
        ? prev.filter((s) => s !== company)
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
    setPriceRange([0, 2000]);
    setCompanySearch("");
    setFeatureSearch("");
    setCurrentPage(1);
  };

  let filteredProducts = products.filter((product) => {
    const matchPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchCompany =
      selectedCompanys.length === 0 ||
      selectedCompanys.includes(product.company);
    const matchFeature =
      selectedFeatures.length === 0 ||
      selectedFeatures.every((feature) => product.features.includes(feature));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Product Catalog</title>
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
      </Helmet>

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
          <aside className="col-span-2 space-y-6 sticky top-6 self-start">
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
              <div>
                <div className="flex justify-between items-center font-semibold">
                  <span>Company</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="flex items-center border px-2 mt-2 rounded">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={CompanySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="w-full py-1 focus:outline-none"
                  />
                </div>
                <div className="mt-2 space-y-2">
                  {[...new Set(products.map((p) => p.company))]
                    .filter((name) =>
                      (name || "")
                        .toLowerCase()
                        .includes(CompanySearch.toLowerCase())
                    )
                    .map((name) => (
                      <div key={name} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedCompanys.includes(name)}
                          onChange={() => toggleCompany(name)}
                        />
                        <span>{name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div>
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
                  {[...new Set(products.flatMap((p) => p.features || []))]
                    .filter((feature) =>
                      (feature || "")
                        .toLowerCase()
                        .includes(featureSearch.toLowerCase())
                    )
                    .map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center space-x-2"
                      >
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
            </div>

            <Button className="w-full mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </aside>

          <section className="col-span-10">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">
                Showing {filteredProducts.length} products
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

            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-700">
                  No products found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters or search criteria
                </p>
                <Button className="mt-4" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
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
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Catalog;
