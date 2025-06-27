import React from "react";
import Header from "./header/index";
import Footer from "./home/Footer";
import Button from "./ui/button";
import Input from "../components/ui/input";

function CheckoutStep2() {
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
          <div className="flex items-center space-x-2 text-blue-600">
            <span className="text-2xl">📦</span>
            <span className="font-semibold">Step 2</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-2xl">✅</span>
            <span>Step 3</span>
          </div>
        </div>

        {/* Shipping Options */}
        <div className="space-y-6">
          {/* Option 1 */}
          <div className="flex items-center justify-between border rounded p-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="shipping" className="accent-blue-600" />
              <div>
                <p className="font-semibold">Free Regular Shipping</p>
                <p className="text-gray-600 text-sm">
                  Estimated delivery in 5–7 days
                </p>
              </div>
            </label>
            <p className="text-sm text-gray-500">June 10, 2025</p>
          </div>

          {/* Option 2 */}
          <div className="flex items-center justify-between border rounded p-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="shipping" className="accent-blue-600" />
              <div>
                <p className="font-semibold">$1.80 - Get Delivery Fast</p>
                <p className="text-gray-600 text-sm">
                  Estimated delivery in 1–2 days
                </p>
              </div>
            </label>
            <p className="text-sm text-gray-500">June 7, 2025</p>
          </div>

          {/* Option 3 */}
          <div className="flex items-center justify-between border rounded p-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="shipping" className="accent-blue-600" />
              <div>
                <p className="font-semibold">Schedule Your Delivery</p>
                <p className="text-gray-600 text-sm">Pick a preferred date</p>
              </div>
            </label>
            <Input type="date" className="w-40" />
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
export default CheckoutStep2;
