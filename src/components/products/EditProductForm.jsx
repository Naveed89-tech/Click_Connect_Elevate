// ✅ EditProductForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ProductForm from "../products/ProductForm";

const EditProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInitialData({ ...data, id });
        } else {
          alert("Product not found");
          navigate("/admin/products");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleUpdate = async (updatedData) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, updatedData);
      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  if (loading) return <div className="p-6">Loading product...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      <ProductForm
        onSubmit={handleUpdate}
        onCancel={() => navigate("/admin/products")}
        initialData={initialData}
      />
    </div>
  );
};

export default EditProductForm;
