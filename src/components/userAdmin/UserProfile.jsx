import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FaUser, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
const UserProfile = ({ fromComponent, onBack }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const action = searchParams.get("action");
  const addressId = searchParams.get("addressId");

  const source = fromComponent || searchParams.get("source");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "HOME",
    name: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // If editing address, fetch address data
        if (action === "edit" && addressId) {
          const addressRef = doc(db, "users", user.uid, "addresses", addressId);
          const addressSnap = await getDoc(addressRef);

          if (addressSnap.exists()) {
            const addressData = addressSnap.data();
            setFormData({
              type: addressData.type || "HOME",
              name: addressData.name || "",
              address: addressData.full || addressData.address || "",
              phone: addressData.phone || "",
            });
          }
        }
      } catch (error) {
        toast.error("Failed to load address data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, action, addressId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSaving(true);
    try {
      // Handle address (either add new or update existing)
      const addressDocRef =
        action === "edit" && addressId
          ? doc(db, "users", user.uid, "addresses", addressId)
          : doc(db, "users", user.uid, "addresses", `address_${Date.now()}`);

      await setDoc(addressDocRef, {
        type: formData.type,
        name: formData.name,
        address: formData.address,
        full: formData.address, // For backward compatibility
        phone: formData.phone,
        updatedAt: serverTimestamp(),
        label: formData.type === "HOME" ? "Primary" : formData.type,
      });
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          displayName: formData.name || user.displayName || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("Address saved successfully!");
      setTimeout(() => {
        if (onBack) {
          // If onBack callback is provided, use it
          onBack();
        } else if (source === "AddressSelection") {
          // Fallback for AddressSelection source
          navigate("/checkout/address"); // Or your checkout route
        } else {
          // Default (from header/profile) go to home
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    } else if (source === "AddressSelection") {
      navigate("/checkout/address");
    } else {
      navigate("/");
    }
  };
  if (!user) {
    return (
      <div className="text-center mt-10 text-lg text-red-500">
        Please log in to manage addresses.
      </div>
    );
  }
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid phone number (10-15 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (loading) return <p className="text-center mt-10">Loading address...</p>;

  return (
    <div className="max-w-md mx-auto p-4 mt-6 mb-6 bg-white rounded-lg shadow font-Montserrat">
      <Toaster position="top-center" />
      <h2 className="text-[24px] font-bold mb-6 text-primary">
        {action === "edit" ? "Edit Address" : "Add New Address"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-bold mb-1 text-primary ">
            Address Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="relative">
          <label className="block text-sm font-bold mb-1 text-primary">
            Name
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-bold mb-1 text-primary">
            Address
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-2 ${
                errors.address
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-xs text-red-500 mt-1">{errors.address}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-bold mb-1 text-primary">
            Phone Number
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-2 ${
                errors.phone
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 hover:border-gray-500 rounded-md text-sm font-medium hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-8 py-2 rounded-md text-sm font-medium text-white ${
              saving
                ? "bg-blue-400"
                : "bg-primary hover:bg-secondary hover:cursor-pointer"
            }`}
          >
            {saving ? "Saving..." : action === "edit" ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;