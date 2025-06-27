import React from "react";
import Header from "./header/index";
import Footer from "./home/Footer";
import Button from "./ui/button";
import Input from "../components/ui/input";

function CheckoutStep3() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto p-4 bg-white mt-6 rounded shadow">
        {/* Step Indicator */}
        <div className="flex items-center space-x-8 mb-8">
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-2xl">🛒</span>
            <span>Step 1</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-2xl">📦</span>
            <span>Step 2</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <span className="text-2xl">✅</span>
            <span className="font-semibold">Step 3</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-6">
          {/* Cash on Delivery */}
          <div className="flex items-center justify-between border rounded p-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="payment"
                checked
                className="accent-blue-600"
                readOnly
              />
              <div>
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-gray-600 text-sm">
                  Pay when the product is delivered
                </p>
              </div>
            </label>
            <span className="text-2xl">💵</span>
          </div>

          {/* Credit Card (Disabled) */}
          <div className="flex items-center justify-between border rounded p-4 opacity-50 cursor-not-allowed">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="payment"
                disabled
                className="accent-blue-600"
              />
              <div>
                <p className="font-semibold">Credit/Debit Card</p>
                <p className="text-gray-600 text-sm">Coming Soon</p>
              </div>
            </label>
            <span className="text-2xl">💳</span>
          </div>

          {/* PayPal (Disabled) */}
          <div className="flex items-center justify-between border rounded p-4 opacity-50 cursor-not-allowed">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="payment"
                disabled
                className="accent-blue-600"
              />
              <div>
                <p className="font-semibold">PayPal</p>
                <p className="text-gray-600 text-sm">Coming Soon</p>
              </div>
            </label>
            <span className="text-2xl">🅿️</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button className="bg-gray-300 text-black hover:bg-gray-400">
              Back
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Next</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
export default CheckoutStep3;
