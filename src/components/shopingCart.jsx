import React from "react";
import Header from "../components/header/index";
import Footer from "./home/Footer";
import Button from "../components/ui/button";
import Input from "../components/ui/input";

function ShoppingCartPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items Column */}
        <div className="md:col-span-2 space-y-6">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="bg-white p-4 rounded shadow flex items-center gap-4"
            >
              <img
                src={`/product${item}.jpg`}
                alt="Product"
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Product Title {item}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Button className="px-2 py-1">-</Button>
                  <span>1</span>
                  <Button className="px-2 py-1">+</Button>
                </div>
              </div>
              <div className="text-lg font-semibold">$299.99</div>
              <button className="text-red-500 hover:text-red-700 text-xl">
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Column */}
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <Input placeholder="Discount code" />
          <hr />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$599.98</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Estimated Tax</span>
            <span>$15.00</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Estimated Shipping</span>
            <span>$5.00</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>$619.98</span>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Checkout
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
export default ShoppingCartPage;
