import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiX, FiPlus } from "react-icons/fi";
import { BsCircle, BsCheckCircleFill } from "react-icons/bs";
import UserProfile from "../../components/userAdmin/UserProfile"; // Import your UserProfile component

const AddressSelection = ({ onNext }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
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
        if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0].id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [user, showAddressForm]); // Add showAddressForm to dependencies

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
    console.log("delete clicked");
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
        onBack={handleBackFromForm} // This is crucial
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Select Address</h2>
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span className="text-blue-600 font-medium">Step 1: Address</span>
          <span>Step 2: Shipping</span>
          <span>Step 3: Payment</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAddress === address.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedAddress(address.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                {selectedAddress === address.id ? (
                  <BsCheckCircleFill className="text-blue-600 text-xl" />
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
                className="text-gray-600 hover:text-blue-600"
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
        className="flex items-center text-blue-600 font-medium mb-8"
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
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue to Shipping
        </button>
      </div>
    </div>
  );
};

export default AddressSelection;
