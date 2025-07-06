import {
  useEffect,
  useState,
} from 'react';

import useFirestoreProducts from '../../hooks/useFirestoreProducts';
// ✅ ProductCard import
import ProductCard from '../ui/ProductCard';

const RelatedProducts = ({ currentProduct }) => {
  const allProducts = useFirestoreProducts();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!currentProduct?.category) return;
    const normalize = (str) =>
      str
        ?.toLowerCase()
        .replace(/[_\s]+/g, "-")
        .replace(/([a-z])([A-Z])/g, "$1-$2");

    const filtered = allProducts.filter(
      (p) =>
        normalize(p.category) === normalize(currentProduct.category) &&
        p.id !== currentProduct.id
    );

    setRelated(filtered.slice(0, 4)); // show top 4
  }, [allProducts, currentProduct]);

  if (related.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
