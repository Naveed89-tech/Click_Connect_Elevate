import { useState } from "react";

import { FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

import useProducts from "../../hooks/useProducts";
import ProductTable from "../AdminDashBoard/products/ProductTable";

const ProductsList = () => {
  const { products, loading, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Product Management
        </h1>
        <div className="flex space-x-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="smartHome">Smart Home</option>
            <option value="industrial_IoT">Industrial IoTs</option>
            <option value="wearables">Wearables</option>
            <option value="smartCity">Smart City</option>
            <option value="modules">Modules & Generic Devices</option>
            <option value="tracking">Smart Tracking</option>
          </select>
          <Link
            to="/admin/products/add"
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary/70 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ProductTable products={filteredProducts} onDelete={deleteProduct} />
      )}
    </div>
  );
};

export default ProductsList;
