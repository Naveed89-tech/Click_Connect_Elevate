import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user: currentUser } = useAuth();
  const isMounted = useRef(true);
  const shouldSaveCart = useRef(false);
  const initialLoadComplete = useRef(false);

  // ✅ 1. Load cart when user changes
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    console.log("[CART] User state changed:", currentUser?.uid || "null");

    if (!currentUser) {
      console.log("[CART] User logged out - clearing local cart");
      if (initialLoadComplete.current) {
        setCartItems([]);
      }
      shouldSaveCart.current = false;
      initialLoadComplete.current = false;
      return;
    }

    const loadCart = async () => {
      try {
        const ref = doc(db, "carts", currentUser.uid);
        const snap = await getDoc(ref);

        if (!isMounted.current) return;

        if (snap.exists()) {
          const data = snap.data();
          console.log("[CART] Loaded cart data:", data.items || "empty array");
          setCartItems(data.items || []);
        } else {
          console.log("[CART] No existing cart document found");
          // Don't create empty doc here - wait for first actual update
        }

        initialLoadComplete.current = true;
        shouldSaveCart.current = true;
      } catch (err) {
        console.error("[CART] Load error:", err);
        toast.error("Failed to load cart");
      }
    };

    loadCart();
  }, [currentUser?.uid]);

  // ✅ 2. Save cart (debounced and protected)
  useEffect(() => {
    if (
      !currentUser ||
      !shouldSaveCart.current ||
      !initialLoadComplete.current
    ) {
      console.log("[CART] Skipping save - conditions not met");
      return;
    }

    console.log(
      `[CART] Preparing to save cart for ${currentUser.uid}`,
      cartItems
    );

    const saveCart = async () => {
      try {
        console.log(`[CART] Saving cart to Firestore`);
        await setDoc(
          doc(db, "carts", currentUser.uid),
          { items: cartItems },
          { merge: true } // Preserve other fields in document
        );
        console.log("[CART] Save successful");
      } catch (err) {
        console.error("[CART] Save error:", err);
        toast.error("Failed to save cart");
      }
    };

    const timer = setTimeout(saveCart, 500);
    return () => clearTimeout(timer);
  }, [cartItems, currentUser?.uid]);

  // ✅ 3. Cart operation functions
  const pickUnitPrice = (p) => p.salePrice ?? p.price;
  const addToCart = (productToAdd) => {
    const unitPrice = productToAdd.salePrice ?? productToAdd.price;
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(
        (item) => item.id === productToAdd.id
      );

      if (existingItem) {
        // If exists, update quantity
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + productToAdd.quantity }
            : item
        );
      }
      // If new item, add to cart
      return [...prevItems, { ...productToAdd, unitPrice }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    toast.success("Cart cleared");
    setCartItems([]);
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 } // unitPrice already set
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
