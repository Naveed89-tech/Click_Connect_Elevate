import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/button";
import useFirestoreProducts from "../../hooks/useFirestoreProducts";
import ProductCard from "../../components/ui/ProductCard";

const TABS = [
  { label: "New Arrival", value: "new arrival" },
  { label: "Best Seller", value: "best seller" },
  { label: "Featured", value: "featured" },
];

function ProductTabsSection() {
  const [activeTab, setActiveTab] = useState("new arrival");

  const allProducts = useFirestoreProducts();

  if (!allProducts) {
    return (
      <section className="px-6 md:px-16 py-20 bg-gray-100 text-center text-gray-500">
        Loading products...
      </section>
    );
  }

  const filteredProducts = allProducts.filter(
    (product) =>
      Array.isArray(product.tags) &&
      product.tags.includes(activeTab.toLowerCase())
  );

  return (
    <section className="px-6 md:px-16 py-20 bg-background">
      {/* Tabs */}
      <div className="flex gap-6 mb-8 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`text-lg font-medium font-Montserrat pb-2 border-b-2 transition whitespace-nowrap ${
              activeTab === tab.value
                ? "border-secondary text-primary"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid - Updated with proper gap and responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductTabsSection;
