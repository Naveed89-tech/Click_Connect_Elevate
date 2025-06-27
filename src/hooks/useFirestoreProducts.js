// hooks/useFirestoreProducts.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const useFirestoreProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name || "Unnamed Product",
          price: data.salePrice || data.price || 0,
          company: data.company || "Generic Company",
          seller: data.seller || "Unknown Seller",
          features: data.features || [],
          rating: data.rating ?? 0,
          reviewCount: data.reviewCount ?? 0,
          images: data.images || [],
          description: data.description || "No description available",
          introduction: data.introduction || "No introduction available",
          tags: data.tags || "No Tag found",
          category: data.category || "No Category found",
        };
      });
      setProducts(fetched);
    });

    return () => unsubscribe();
  }, []);

  return products;
  
};

export default useFirestoreProducts;
