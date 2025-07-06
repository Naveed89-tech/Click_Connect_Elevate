import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import {
  FiArrowRight,
  FiHelpCircle,
  FiLink,
  FiUser,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

export default function ProfileModal({ isOpen, onClose }) {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setState] = useState("");
  const [postal, setPostal] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !user) return;

    // prefill profile fields
    setDisplayName(user.displayName || "");
    setAvatarURL(user.photoURL || "");

    // prefill Home address (if any)
    (async () => {
      try {
        const snap = await getDoc(
          doc(db, "users", user.uid, "addresses", "home")
        );
        if (snap.exists()) {
          const d = snap.data();
          setStreet(d.street ?? "");
          setCity(d.city ?? "");
          setState(d.state ?? "");
          setPostal(d.postal ?? "");
          setPhone(d.phone ?? "");
        }
      } catch (err) {
        console.error("Prefill address failed:", err);
      }
    })();

    // clear validation errors & set focus
    setErrors({});
    setTimeout(() => nameRef.current?.focus(), 100);
  }, [isOpen, user]);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const validate = () => {
    const errs = {};

    if (!displayName.trim()) errs.displayName = "Required";
    if (avatarURL && !/^https?:\/\//i.test(avatarURL.trim()))
      errs.avatarURL = "URL must start with http(s)";

    if (!street.trim()) errs.street = "Street required";
    if (!city.trim()) errs.city = "City required";
    if (!postal.trim()) errs.postal = "Postal code required";
    if (!phone.trim()) errs.phone = "Phone required";
    else if (!/^\d{10,15}$/.test(phone.trim()))
      errs.phone = "10-15 digit phone";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !validate()) return;

    setIsSubmitting(true);
    try {
      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL: avatarURL.trim() || null,
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: displayName.trim(),
          photoURL: avatarURL.trim() || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await setDoc(
        doc(db, "users", user.uid, "addresses", "home"),
        {
          /* what checkout expects */
          type: "HOME",
          label: "Home",
          name: displayName.trim(),
          address:
            `${street.trim()}, ${city.trim()}, ${stateProv.trim()} ${postal.trim()}`
              .replace(/\s+,/g, ",")
              .replace(/,\s+$/, ""),
          phone: phone.trim(),

          /* granular fields for future editing */
          street: street.trim(),
          city: city.trim(),
          state: stateProv.trim(),
          postal: postal.trim(),

          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await refreshUser?.();
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden animate-scaleIn my-8 max-h-[90vh] flex flex-col">
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Update your public information
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center mb-4">
            <div className="relative group">
              {avatarURL ? (
                <img
                  src={avatarURL}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary transition-colors"
                  onError={() => setAvatarURL("")}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 text-gray-400">
                  <FiUser size={28} />
                </div>
              )}
            </div>
          </div>

          <form id="profile-form" onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  ref={nameRef}
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.displayName
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  }`}
                  placeholder="Your public name"
                />
              </div>
              {errors.displayName && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.displayName}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Avatar URL
                </label>
                <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FiHelpCircle className="mr-1" size={12} />
                  Optional
                </span>
              </div>
              <div className="relative">
                <FiLink
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="url"
                  value={avatarURL}
                  onChange={(e) => setAvatarURL(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.avatarURL
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  }`}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              {errors.avatarURL && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.avatarURL}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Tip: Use image hosting services like Imgur, Unsplash, or
                Cloudinary
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Street
                </label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.street
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  }`}
                  placeholder="123 Main St"
                />
                {errors.street && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.street}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.city
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  }`}
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <input
                  value={stateProv}
                  onChange={(e) => setState(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.stateProv
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  }`}
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postal Code
                </label>
                <input
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.postal
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  }`}
                  placeholder="10001"
                />
                {errors.postal && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.postal}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                }`}
                placeholder="1234567890"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            form="profile-form"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                Save Changes <FiArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
