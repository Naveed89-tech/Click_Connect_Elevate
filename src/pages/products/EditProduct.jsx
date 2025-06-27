import { useParams, useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';

import ProductForm from '../../components/products/ProductForm';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();

  const product = products.find(p => p.id === id);

  const handleSubmit = (productData) => {
    updateProduct({ ...productData, id });
    navigate('/products');
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
      </div>
      <ProductForm 
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditProduct;