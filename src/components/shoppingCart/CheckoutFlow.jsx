import React, { useState } from "react";

import AddressSelection from "../shoppingCart/AddressSelection";
import ShippingMethod from "../shoppingCart/ShippingMethod";
import PaymentMethod from "../shoppingCart/PaymentMethod";
import OrderConfirmation from "../shoppingCart/OrderConfirmation";

const CheckoutFlow = () => {
  const [step, setStep] = useState(1);
  const [shippingCost, setShippingCost] = useState(29);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const baseTotal = 2347 + 50; // subtotal + tax

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      {step === 1 && (
        <AddressSelection
          onNext={handleNext}
          onSelect={setSelectedAddress}
          selected={selectedAddress}
        />
      )}
      {step === 2 && (
        <ShippingMethod
          baseTotal={baseTotal}
          onShippingChange={setShippingCost}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <PaymentMethod
          total={baseTotal + shippingCost}
          onBack={handleBack}
          onNext={handleNext}
          address={selectedAddress}
        />
      )}
      {step === 4 && (
        <OrderConfirmation
          total={baseTotal + shippingCost}
          address={selectedAddress}
        />
      )}
    </div>
  );
};

export default CheckoutFlow;
