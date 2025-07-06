import React, { useEffect, useState } from "react";

import { serverTimestamp } from "firebase/firestore";
import PropTypes from "prop-types";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";

import CategorySelector from "./CategorySelector";

const ProductForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    introduction: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    images: [],
    variants: [],
    status: "draft",
    sku: "",
    salePrice: 0,
    cost: 0,
    weight: 0,
    company: "",
    features: [],
    tags: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        features: initialData.features || [],
        tags: initialData.tags || [],
      }));
    }
  }, [initialData]);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [variant, setVariant] = useState({ name: "", options: [] });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "salePrice" ||
        name === "cost" ||
        name === "stock" ||
        name === "weight"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleFeatureChange = (index, value) => {
    setFormData((prev) => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addImageUrl = () => {
    const trimmedUrl = newImageUrl.trim();
    if (
      !trimmedUrl.startsWith("http://") &&
      !trimmedUrl.startsWith("https://")
    ) {
      alert("Please enter a valid image URL starting with http:// or https://");
      return;
    }
    setFormData((prev) => ({ ...prev, images: [...prev.images, trimmedUrl] }));
    setNewImageUrl("");
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariant((prev) => ({ ...prev, [name]: value }));
  };

  const addVariantOption = () => {
    if (variant.name && variant.options.length > 0) {
      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, variant],
      }));
      setVariant({ name: "", options: [] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      await onSubmit({ ...formData, createdAt: serverTimestamp() });
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to save product.");
    } finally {
      setUploading(false);
    }
  };

  if (!formData.name && initialData) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all"
                required
              />
            </div>
            {/*  start  */}

            {/*  start  */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Introduction
              </label>
              <textarea
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400   border-gray-200  focus:border-blue-500   transition-all"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 border-gray-200  focus:border-blue-500 transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                More Details (Features)
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-500 w-6 text-right">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="mt-2 flex items-center text-secondary hover:text-blue-800 text-sm"
                >
                  <FiPlus className="mr-1" /> Add Feature
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL (e.g., https://example.com/image.jpg)"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 w-full  border-gray-200  focus:border-blue-500  transition-all"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addImageUrl())
                  }
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/60 cursor-pointer flex items-center"
                >
                  <FiPlus className="mr-1" /> Add
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Tip: Use direct image URLs from GitHub, CDN, or other image
                hosting services
              </p>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="h-20 w-20 object-cover rounded border"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100?text=Image+Error";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-4">
                Product Details
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <div className="relative w-full group">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 font-Rubik py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer appearance-none bg-white shadow-sm text-gray-700 font-medium"
                    required
                  >
                    <option value="draft" className="text-gray-500 italic">
                      Draft
                    </option>
                    <option value="published" className="text-gray-500 italic">
                      Published
                    </option>
                    <option
                      value="out_of_stock"
                      className="text-gray-500 italic"
                    >
                      Out of Stock
                    </option>
                  </select>

                  {/* Premium Chevron Indicator */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-transform duration-200 group-hover:translate-y-0.5">
                    <svg
                      className="w-6 h-6 text-gray-400 group-focus:text-blue-500 transition-colors duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <CategorySelector
                  value={formData.category}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:ring-1 focus:ring-blue-400  border-gray-200  focus:border-blue-500  transition-all"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (for filters/highlights)
                </label>
                <div className="space-y-2">
                  {["new arrival", "featured", "best seller"].map((tag) => (
                    <label key={tag} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            tags: checked
                              ? [...prev.tags, tag]
                              : prev.tags.filter((t) => t !== tag),
                          }));
                        }}
                      />
                      <span className="capitalize text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400  border-gray-200  focus:border-blue-500  transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none   focus:ring-1 focus:ring-blue-400  border-gray-200  focus:border-blue-500  transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none   border-gray-200  focus:border-blue-500  transition-all   focus:ring-1 focus:ring-blue-400  border-gray-200  focus:border-blue-500  transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:ring-1 focus:ring-blue-400  border-gray-200  focus:border-blue-500  transition-all  "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none    focus:ring-1 focus:ring-blue-400  border-gray-200  focus:border-blue-500  transition-all"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none   focus:ring-1 focus:ring-blue-400  border-gray-200  focus:border-blue-500  transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="mt-8 border-t border-gray-300 pt-6">
          <h3 className="font-medium text-gray-700 mb-4">Product Variants</h3>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variant Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={variant.name}
                  onChange={handleVariantChange}
                  placeholder="e.g. Color, Size"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:ring-1 focus:ring-blue-400  border-gray-200  focus:border-blue-500  transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (comma separated)
                </label>
                <input
                  type="text"
                  name="options"
                  value={variant.options.join(",")}
                  onChange={(e) =>
                    setVariant((prev) => ({
                      ...prev,
                      options: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item !== ""),
                    }))
                  }
                  placeholder="e.g. Red, Blue, Green"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:ring-1 focus:ring-blue-400  border-gray-200  focus:border-blue-500  transition-all  "
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addVariantOption}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary/60 cursor-pointer"
              disabled={!variant.name || variant.options.length === 0}
            >
              <FiPlus className="mr-2" />
              Add Variant
            </button>
          </div>

          {formData.variants.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Options
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.variants.map((v, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {v.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {v.options.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              variants: prev.variants.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border cursor-pointer border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/60 disabled:bg-primary/8 cursor-pointer"
          >
            {uploading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

ProductForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ProductForm;
