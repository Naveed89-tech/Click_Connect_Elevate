import React, { useEffect, useState } from "react";
import Header from "../components/header/index";
import Footer from "./home/Footer";
import Button from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

function CheckoutStep1() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      try {
        const addressesRef = collection(db, "users", user.uid, "addresses");
        const snapshot = await getDocs(addressesRef);
        const userAddresses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAddresses(userAddresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [user]);

  const handleAddNew = () =>
    navigate("/profile?redirectTo=checkout&action=add");

  const handleEdit = (addressId) => {
    navigate(`/profile?redirectTo=checkout&action=edit&addressId=${addressId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto p-4 bg-white mt-6 rounded shadow">
        {/* Step Indicator */}
        <div className="flex items-center space-x-8 mb-8">
          <div className="flex items-center space-x-2 text-blue-600">
            <span className="text-2xl">🛒</span>
            <span className="font-semibold">Step 1</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-2xl">📦</span>
            <span>Step 2</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-2xl">✅</span>
            <span>Step 3</span>
          </div>
        </div>

        {/* Address Selection */}
        <div className="space-y-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-center justify-between border rounded p-4"
            >
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="address"
                  className="accent-blue-600"
                />
                <div>
                  <p className="font-semibold">{address.name || "Name"}</p>
                  <p className="text-gray-600 text-sm">
                    {address.address} — {address.phone}
                  </p>
                </div>
              </label>
              <FiEdit2
                className="text-gray-700 cursor-pointer"
                onClick={() => handleEdit(address.id)}
              />
            </div>
          ))}

          {/* Add New Address */}
          <button
            onClick={handleAddNew}
            className="text-blue-600 flex items-center justify-center gap-1"
          >
            <span className="text-xl font-bold">+</span> Add New Address
          </button>

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

export default CheckoutStep1;
