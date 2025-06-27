import React from "react";
import { Link } from "react-router-dom";
const Categories = () => {
  const categories = [
    { name: "Smart Home", description: "Devices for home automation." },
    {
      name: "Industrial IoT",
      description: "Solutions for factories and industry.",
    },
    { name: "Wearables", description: "Smart watches and fitness trackers." },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <Link
          to="/admin/categories/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Category
        </Link>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Description</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2">{category.name}</td>
              <td className="py-2">{category.description}</td>
              <td className="py-2">
                <button className="text-blue-600 hover:underline text-xs mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:underline text-xs">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
