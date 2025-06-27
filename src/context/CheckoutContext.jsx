// CheckoutContext.jsx
import React, { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();
export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]); // ✅ Moved inside
  const [cartSubtotal, setCartSubtotal] = useState(0); // ✅ Moved inside

  // and expose setAddress in the context value

  return (
    <CheckoutContext.Provider
      value={{
        address,
        setAddress,
        shippingCost,
        setShippingCost,
        total,
        setTotal,
        cartItems,
        setCartItems,
        cartSubtotal,
        setCartSubtotal,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
