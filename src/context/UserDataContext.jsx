import { createContext, useContext, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "./WishlistContext"; // if you have it

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();
  const { cartItems, setCartItems } = useCart();
  const { wishlistItems, setWishlistItems } = useWishlist(); // optional

  // Load saved data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setCartItems(data.cart || []);
        setWishlistItems(data.wishlist || []);
      } else {
        await setDoc(ref, { cart: [], wishlist: [] });
      }
    };

    fetchData();
  }, [user]);

  // Save cart to Firestore
  useEffect(() => {
    const saveCart = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { cart: cartItems });
    };
    saveCart();
  }, [cartItems]);

  // Save wishlist to Firestore
  useEffect(() => {
    const saveWishlist = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { wishlist: wishlistItems });
    };
    saveWishlist();
  }, [wishlistItems]);

  return (
    <UserDataContext.Provider value={{}}>{children}</UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
