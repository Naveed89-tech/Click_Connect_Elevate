// pages/admin/ProductList.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const products = [
    {
      name: "Smart Sensor",
      category: "Smart Home",
      price: "$49",
      stock: 32,
      status: "Active",
    },
    {
      name: "Industrial Gateway",
      category: "Industrial IoT",
      price: "$199",
      stock: 12,
      status: "Inactive",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Product List</h2>
        <Link
          to="/admin/products/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Category</th>
            <th className="text-left py-2">Price</th>
            <th className="text-left py-2">Stock</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2">{product.name}</td>
              <td className="py-2">{product.category}</td>
              <td className="py-2">{product.price}</td>
              <td className="py-2">{product.stock}</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="py-2">
                <button className="text-blue-600 hover:underline text-xs">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
