import "react-datepicker/dist/react-datepicker.css";

import React, { useEffect, useState } from "react";

import { format } from "date-fns";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import { BsCheckCircleFill, BsChevronDown, BsCircle } from "react-icons/bs";

import { useCheckout } from "../../context/CheckoutContext";

/* ------------------------------------------------------------------ */
/* static options – price for id 3 will be computed on the fly        */
/* ------------------------------------------------------------------ */
const shippingOptions = [
  {
    id: 1,
    label: "Free",
    description: "Regular shipment",
    price: 0,
    date: "17 Oct 2023",
  },
  {
    id: 2,
    label: "$8.50",
    description: "Get it fast",
    price: 8.5,
    date: "1 Oct 2023",
  },
  {
    id: 3,
    label: "Schedule",
    description: "Pick your date",
    isDropdown: true, // price will be calculated
  },
];

/* helper – dollar amount for a chosen date ------------------------- */
const getScheduledPrice = (date) => {
  if (!date) return 0; // nothing chosen yet
  const diffHrs = (date - Date.now()) / 36e5; // ms → hours
  if (diffHrs <= 48) return 20;
  if (diffHrs <= 72) return 15;
  return 8;
};

const ShippingMethod = ({ onNext, onBack }) => {
  /* local state ---------------------------------------------------- */
  const [selectedId, setSelectedId] = useState(1);
  const [scheduledDate, setScheduledDate] = useState(null);

  /* checkout context ---------------------------------------------- */
  const { cartSubtotal, setShippingCost, setTotal } = useCheckout();

  /* whenever selection or date changes, update costs -------------- */
  useEffect(() => {
    const cost =
      selectedId === 3
        ? getScheduledPrice(scheduledDate)
        : shippingOptions.find((o) => o.id === selectedId).price;

    setShippingCost(cost);
    setTotal(cartSubtotal + cost);
  }, [selectedId, scheduledDate, cartSubtotal, setShippingCost, setTotal]);

  /* UI ------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        {/* progress bar header */}
        <div className="flex justify-between mb-10">
          {/* Step 1 – inactive */}
          <div className="text-sm text-text-muted">
            Step&nbsp;1&nbsp;Address
          </div>

          {/* Step 2 – active */}
          <div className="text-sm font-medium text-primary">
            <span className="text-secondary">Step&nbsp;2</span>&nbsp;Shipping
          </div>

          {/* Step 3 – inactive */}
          <div className="text-sm text-text-muted">
            Step&nbsp;3&nbsp;Payment
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6">Shipment Method</h2>

        {/* options list */}
        <div className="space-y-4">
          {shippingOptions.map((option) => {
            /* dynamic label / price for the scheduled row ---------- */
            const dynPrice =
              option.id === 3 ? getScheduledPrice(scheduledDate) : option.price;

            return (
              <div
                key={option.id}
                className={`flex items-center justify-between p-5 rounded-lg border cursor-pointer bg-gray-50 hover:border-blue-500 transition ${
                  selectedId === option.id
                    ? "border-primary"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedId(option.id)}
              >
                {/* radio + label */}
                <div className="flex items-start gap-4">
                  <div className="pt-1 text-primary">
                    {selectedId === option.id ? (
                      <BsCheckCircleFill size={20} />
                    ) : (
                      <BsCircle size={20} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {option.label}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* right-hand column */}
                <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {option.id === 3 ? (
                    /* ---------- scheduled picker row ----------- */
                    <div className="relative">
                      <DatePicker
                        selected={scheduledDate}
                        onChange={setScheduledDate}
                        placeholderText="Select date"
                        minDate={new Date()}
                        dateFormat="dd MMM yyyy"
                        className="w-full bg-gray-50 border border-gray-300 rounded-md
                                   py-1.5 px-3 focus:outline-none
                                   focus:ring-2 focus:ring-blue-500"
                      />
                      {/* mini tooltip once a date is chosen */}
                      {scheduledDate && (
                        <motion.div
                          drag
                          dragMomentum={false} // stops it “gliding” after release
                          className="absolute bottom-full left-0 mb-2
               bg-white shadow-lg rounded-md p-3 z-20
               border border-border cursor-move" // ✨ cursor hint
                        >
                          <div className="text-sm font-medium text-text-primary">
                            Selected: {format(scheduledDate, "MMMM d, yyyy")}
                          </div>
                          <div className="text-sm text-success font-semibold mt-1">
                            +${dynPrice.toFixed(2)} (Scheduled)
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    /* ---------- regular rows -------------------- */
                    <div className="flex items-center gap-2">
                      {option.date}
                      {option.price > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          +${option.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                  {option.isDropdown && (
                    <BsChevronDown className="text-gray-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* summary line */}
        <div className="mt-6 text-right text-sm font-semibold text-gray-800">
          Shipping Cost:&nbsp;$
          {(selectedId === 3
            ? getScheduledPrice(scheduledDate)
            : shippingOptions.find((o) => o.id === selectedId).price
          ).toFixed(2)}
          &nbsp;| Total:&nbsp;$
          {(
            cartSubtotal +
            (selectedId === 3
              ? getScheduledPrice(scheduledDate)
              : shippingOptions.find((o) => o.id === selectedId).price)
          ).toFixed(2)}
        </div>

        {/* nav buttons */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            className="px-6 py-2 border rounded hover:bg-gray-100"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
            onClick={onNext}
            disabled={selectedId === 3 && !scheduledDate}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
