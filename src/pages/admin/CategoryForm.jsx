// pages/admin/CategoryForm.jsx
import React, { useState } from "react";

const CategoryForm = () => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Category added successfully!");
    console.log(category);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Add New Category
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category Name
          </label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={category.description}
            onChange={handleChange}
            rows={3}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
