import React, { useEffect, useState } from "react";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

/* ------------------------------------------------------------ */
/* Address form used inside checkout (add / edit Home, Work ...) */
/* ------------------------------------------------------------ */
const UserProfile = ({ fromComponent, onBack }) => {
  /* ---------- routing / params ---------- */
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const action = searchParams.get("action"); // "add" | "edit"
  const addressId = searchParams.get("addressId"); // doc ID when editing
  const source = fromComponent || searchParams.get("source");

  /* ---------- auth & nav ---------- */
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ---------- local state ---------- */
  const [formData, setFormData] = useState({
    type: "HOME",
    name: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------- pre-fill when editing ---------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!user || action !== "edit" || !addressId) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(
          doc(db, "users", user.uid, "addresses", addressId)
        );
        if (snap.exists()) {
          const d = snap.data();
          setFormData({
            type: d.type || "HOME",
            name: d.name || "",
            address: d.address || d.full || "",
            phone: d.phone || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load address.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, action, addressId]);

  /* ---------- validation ---------- */
  const validateForm = () => {
    const v = {};
    if (!formData.name.trim()) v.name = "Name is required";
    if (!formData.address.trim()) v.address = "Address is required";
    if (!formData.phone.trim()) v.phone = "Phone required";
    else if (!/^\d{10,15}$/.test(formData.phone.trim()))
      v.phone = "Enter 10-15 digit phone";

    setErrors(v);
    return Object.keys(v).length === 0;
  };

  /* ---------- handlers ---------- */
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setSaving(true);

    const { type, name, address, phone } = formData;
    const label = type.charAt(0) + type.slice(1).toLowerCase(); // Home | Work
    const payload = {
      label,
      type,
      name,
      address,
      phone,
      updatedAt: serverTimestamp(),
    };

    try {
      /* ------------ EDIT ------------ */
      if (action === "edit" && addressId) {
        await setDoc(
          doc(db, "users", user.uid, "addresses", addressId),
          payload,
          { merge: true } // ✱ keep granular fields written elsewhere
        );
      } else {
        /* ---------- ADD / OVERWRITE one-per-type ---------- */
        const deterministicId = type.toLowerCase(); // "home" | "work" | "other"
        await setDoc(
          doc(db, "users", user.uid, "addresses", deterministicId),
          { ...payload, createdAt: serverTimestamp() },
          { merge: true }
        );
      }

      toast.success("Address saved!");
      onBack?.(); // return to AddressSelection
    } catch (err) {
      console.error(err);
      toast.error("Could not save address. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onBack) onBack();
    else if (source === "AddressSelection") navigate("/checkout/address");
    else navigate("/");
  };

  if (!user)
    return (
      <div className="text-center mt-10 text-lg text-red-500">
        Please log in to manage addresses.
      </div>
    );

  if (loading) return <p className="text-center mt-10">Loading…</p>;

  /* ---------- JSX ---------- */
  return (
    <div className="max-w-md mx-auto p-4 mt-6 mb-6 bg-white rounded-lg shadow font-Montserrat">
      <Toaster position="top-center" />

      <h2 className="text-2xl font-bold mb-6 text-primary">
        {action === "edit" ? "Edit Address" : "Add New Address"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* type selector */}
        <div>
          <label className="block text-sm font-bold mb-1 text-primary">
            Address Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={action === "edit" ? undefined : handleChange}
            disabled={action === "edit"} /* ✱ lock type while editing */
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* name */}
        <InputField
          icon={FaUser}
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        {/* address */}
        <InputField
          icon={FaMapMarkerAlt}
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
        />

        {/* phone */}
        <InputField
          icon={FaPhone}
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        {/* buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 hover:border-gray-500 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-8 py-2 rounded-md text-sm text-white ${
              saving ? "bg-blue-400" : "bg-primary hover:bg-secondary"
            }`}
          >
            {saving ? "Saving…" : action === "edit" ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- tiny helper component to cut repetition ---------- */
const InputField = ({ icon: Icon, label, name, value, onChange, error }) => (
  <div className="relative">
    <label className="block text-sm font-bold mb-1 text-primary">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
        }`}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default UserProfile;
