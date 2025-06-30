import React, { useEffect, useState } from "react";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";
import { FiEdit2, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import UserProfile from "../../components/userAdmin/UserProfile";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

const AddressSelection = ({ onNext }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);

  // Fetch addresses from Firestore
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

        // Filter to get one address per type
        const uniqueTypeAddresses = [];
        const typesAdded = new Set();

        // Process addresses in reverse to get the most recent addresses first
        [...userAddresses].reverse().forEach((address) => {
          if (!typesAdded.has(address.type)) {
            typesAdded.add(address.type);
            uniqueTypeAddresses.push(address);
          }
        });

        setFilteredAddresses(uniqueTypeAddresses);

        if (uniqueTypeAddresses.length > 0) {
          setSelectedAddress(uniqueTypeAddresses[0].id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [user, showAddressForm]);

  const handleEditAddress = (addressId) => {
    setCurrentAddressId(addressId);
    setShowAddressForm(true);
  };

  const handleAddAddress = () => {
    setCurrentAddressId(null);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "addresses", addressId));
    setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    setFilteredAddresses((prev) => prev.filter((a) => a.id !== addressId));
  };

  const handleBackFromForm = () => {
    setShowAddressForm(false);
  };

  if (showAddressForm) {
    return (
      <UserProfile
        action={currentAddressId ? "edit" : "add"}
        addressId={currentAddressId}
        fromComponent="AddressSelection"
        onBack={handleBackFromForm}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-text-primary">Select Address</h2>

        {/* Checkout Steps */}
        <div className="flex items-center space-x-6 text-sm">
          {/* Active step */}
          <div className="text-sm font-medium text-primary">
            <span className="text-secondary">Step&nbsp;1</span>&nbsp;Address
          </div>

          {/* Upcoming steps */}
          <span className="text-text-muted">Step&nbsp;2: Shipping</span>
          <span className="text-text-muted">Step&nbsp;3: Payment</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {filteredAddresses.map((address) => (
          <div
            key={address.id}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAddress === address.id
                ? "border-primary bg-primary/3"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedAddress(address.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                {selectedAddress === address.id ? (
                  <BsCheckCircleFill className="text-primary text-xl" />
                ) : (
                  <BsCircle className="text-gray-400 text-xl" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{address.label}</h3>
                  <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded uppercase">
                    {address.type}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{address.name}</p>
                <p className="text-gray-600 text-sm">{address.address}</p>
                <p className="text-gray-600 text-sm">{address.phone}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditAddress(address.id);
                }}
                className="text-gray-600 hover:text-primary"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(address.id);
                }}
                className="text-gray-600 hover:text-red-600"
              >
                <FiX />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddAddress}
        className="flex items-center text-secondary cursor-pointer font-medium mb-8"
      >
        <FiPlus className="mr-1" /> Add New Address
      </button>

      <div className="flex justify-end">
        <button
          onClick={() => {
            if (!selectedAddress) {
              alert("Please select an address");
              return;
            }
            const selected = addresses.find((a) => a.id === selectedAddress);
            onNext(selected);
          }}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/70 transition-colors"
        >
          Continue to Shipping
        </button>
      </div>
    </div>
  );
};

export default AddressSelection;
