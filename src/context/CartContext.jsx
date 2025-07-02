import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { doc, getDoc, runTransaction, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// build per‑user localStorage key (guest when uid is undefined/null)
const storageKey = (uid) => `cartBackup_${uid ?? "guest"}`;

export const CartProvider = ({ children }) => {
  /* ---------------- state & refs ---------------- */
  const [cartItems, setCartItems] = useState([]);
  const { user: currentUser } = useAuth(); // undefined → auth initialising
  const isMounted = useRef(true);
  const shouldSaveCart = useRef(false);
  const initialLoadDone = useRef(false);

  /* -------------- helper: stock transaction -------------- */
  const transactStock = async (id, delta /* +1 restock | -1 reserve */) => {
    const ref = doc(db, "products", id);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error("Product no longer exists");
      const cur = snap.data().stock ?? 0;
      if (delta < 0 && cur < -delta) throw new Error("No more stock available");
      tx.update(ref, { stock: cur + delta });
    });
  };
  const restock = (id, qty) => transactStock(id, qty);

  /* -------- helper: sync to localStorage + Firestore -------- */
  const syncCartNow = async (next) => {
    try {
      localStorage.setItem(storageKey(currentUser?.uid), JSON.stringify(next));
      if (!currentUser) return; // guest OR logged‑out
      await setDoc(
        doc(db, "carts", currentUser.uid),
        { items: next },
        { merge: true }
      );
    } catch (e) {
      console.error("[CART] Immediate sync failed", e);
    }
  };

  /* -------- hydrate whenever auth user changes -------- */
  useEffect(() => {
    if (currentUser === undefined) return; // wait for auth

    // 1️⃣ Guest / logged‑out
    if (currentUser === null) {
      const guestBackup = localStorage.getItem(storageKey());
      setCartItems(guestBackup ? JSON.parse(guestBackup) : []);
      shouldSaveCart.current = false;
      initialLoadDone.current = false;
      return;
    }

    // 2️⃣ Logged‑in user
    const hydrate = async () => {
      // show cached cart instantly
      const cached = localStorage.getItem(storageKey(currentUser.uid));
      if (cached) {
        try {
          setCartItems(JSON.parse(cached));
        } catch (_) {}
      }

      try {
        const ref = doc(db, "carts", currentUser.uid);
        const snap = await getDoc(ref);
        if (!isMounted.current) return;

        if (snap.exists()) {
          const now = Date.now();
          const valid = [];
          for (const it of snap.data().items || []) {
            if (it.reservedUntil && it.reservedUntil < now) {
              await restock(it.id, it.quantity);
            } else {
              valid.push(it);
            }
          }
          setCartItems(valid);
          localStorage.setItem(
            storageKey(currentUser.uid),
            JSON.stringify(valid)
          );
        } else if (!cached) {
          setCartItems([]);
        }

        initialLoadDone.current = true;
        shouldSaveCart.current = true;
      } catch (err) {
        console.error("[CART] Load error:", err);
        toast.error("Failed to load cart");
      }
    };
    hydrate();
  }, [currentUser]);

  /* -------- debounced save whenever cartItems change -------- */
  useEffect(() => {
    if (!currentUser || !shouldSaveCart.current || !initialLoadDone.current)
      return;
    const t = setTimeout(() => {
      setDoc(
        doc(db, "carts", currentUser.uid),
        { items: cartItems },
        { merge: true }
      ).catch((err) => {
        console.error("[CART] Save error:", err);
        toast.error("Failed to save cart");
      });
      localStorage.setItem(
        storageKey(currentUser.uid),
        JSON.stringify(cartItems)
      );
    }, 500);
    return () => clearTimeout(t);
  }, [cartItems, currentUser]);

  /* -------- purge expired reservations each minute -------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const expired = cartItems.filter(
        (i) => i.reservedUntil && i.reservedUntil < now
      );
      if (!expired.length) return;
      expired.forEach(({ id, quantity }) => restock(id, quantity));
      setCartItems((prev) =>
        prev.filter((i) => !(i.reservedUntil && i.reservedUntil < now))
      );
    }, 60_000);
    return () => clearInterval(interval);
  }, [cartItems]);

  /* --------------------------- cart helpers --------------------------- */
  const addToCart = (item) => {
    const reservedUntil = Date.now() + 30 * 60 * 1000;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const newItem = existing
        ? {
            ...existing,
            quantity: existing.quantity + item.quantity,
            reservedUntil,
          }
        : { ...item, reservedUntil };
      const next = existing
        ? prev.map((i) => (i.id === item.id ? newItem : i))
        : [...prev, newItem];
      syncCartNow(next);
      return next;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const it = prev.find((i) => i.id === id);
      if (it) restock(id, it.quantity);
      const next = prev.filter((i) => i.id !== id);
      syncCartNow(next);
      return next;
    });
  };

  const clearCart = (shouldRestock = true) => {
    if (shouldRestock) {
      cartItems.forEach(({ id, quantity }) => restock(id, quantity));
    }
    setCartItems([]);
    syncCartNow([]);
    toast.success("Cart cleared");
  };

  const increaseQty = async (id) => {
    try {
      await transactStock(id, -1);
      setCartItems((prev) => {
        const next = prev.map((i) =>
          i.id === id
            ? {
                ...i,
                quantity: i.quantity + 1,
                reservedUntil: Date.now() + 30 * 60 * 1000,
              }
            : i
        );
        syncCartNow(next);
        return next;
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const decreaseQty = async (id) => {
    await restock(id, 1);
    setCartItems((prev) => {
      const next = prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);
      syncCartNow(next);
      return next;
    });
  };

  /* --------------------------- provider --------------------------- */
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
