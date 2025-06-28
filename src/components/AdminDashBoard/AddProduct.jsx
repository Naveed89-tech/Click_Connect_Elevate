import { useNavigate } from "react-router-dom";

import ProductForm from "../../components/AdminDashBoard/products/ProductForm";
import { useAuth } from "../../context/AuthContext";
import useProducts from "../../hooks/useProducts";

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { user } = useAuth();

  const handleSubmit = async (productData) => {
    const fullProductData = {
      ...productData,
      seller: user?.displayName || user?.email || "Admin",
    };

    await addProduct(fullProductData);
    navigate("/products");
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
      </div>
      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default AddProduct;
