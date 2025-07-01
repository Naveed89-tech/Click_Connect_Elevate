import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight, FiLock, FiMail, FiX } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

// Constants for error messages
const ERROR_MESSAGES = {
  email: {
    "auth/invalid-email": "Invalid email address.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/user-not-found": "No account found with this email.",
    "auth/operation-not-allowed": "Sign-in is disabled by admin.",
  },
  password: {
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/wrong-password": "Incorrect password.",
  },
  general: "Something went wrong. Please try again.",
};

const handleFirebaseFieldErrors = (code) => {
  const fieldErrors = {};

  if (ERROR_MESSAGES.email[code]) {
    fieldErrors.email = ERROR_MESSAGES.email[code];
  } else if (ERROR_MESSAGES.password[code]) {
    fieldErrors.password = ERROR_MESSAGES.password[code];
  } else if (code === "auth/invalid-credential") {
    fieldErrors.email = "Invalid email or password.";
    fieldErrors.password = "Invalid email or password.";
  } else {
    fieldErrors.general = ERROR_MESSAGES.general;
  }

  return fieldErrors;
};

function AuthModal({ isOpen, onClose }) {
  const { signup, login, loginWithGoogle, resetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef(null);

  // Focus email input when modal opens
  useEffect(() => {
    if (isOpen && emailRef.current) {
      emailRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  }, [formData, isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await signup(formData.email, formData.password);
        const user = userCredential.user;

        await Promise.all([
          setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: user.displayName || "",
            createdAt: serverTimestamp(),
          }),
          updateProfile(user, {
            displayName: formData.email.split("@")[0],
          }),
        ]);

        toast.success("Account created successfully!");
      } else {
        await login(formData.email, formData.password);
        toast.success("Logged in successfully!");
      }

      onClose();
    } catch (err) {
      console.error("Authentication error:", err);
      setErrors(handleFirebaseFieldErrors(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
      toast.success("Logged in with Google!");
      onClose();
    } catch (err) {
      console.error("Google login error:", err);
      setErrors(handleFirebaseFieldErrors(err?.code || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email.includes("@")) {
      setErrors({ email: "Please enter a valid email to reset password" });
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(formData.email);
      toast.success(
        "We've sent a password reset link to your email. Please check your inbox and spam folder. The link will expire in 1 hour.",
        {
          duration: 6000,
          style: {
            maxWidth: "500px",
            padding: "16px",
          },
        }
      );
    } catch (err) {
      console.error("Password reset error:", err);
      let errorMessage = "Unable to send reset email. Please try again.";

      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      }

      setErrors({ email: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed font-Roboto inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transition-all duration-300 transform scale-95 animate-scaleIn">
        <div className="flex flex-col md:flex-row h-full">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {isSignUp
                    ? "Join & Explore Smart Devices"
                    : "Sign in to Start Shopping"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 mb-6 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FcGoogle size={20} />
              <span>
                {isSignUp ? "Continue with Google" : "Sign in with Google"}
              </span>
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
              <span className="mx-4 text-gray-400 dark:text-gray-500 text-sm">
                or continue with email
              </span>
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    ref={emailRef}
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.email
                        ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.password
                        ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    }`}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.password}
                  </p>
                )}
                {!isSignUp && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={isSubmitting}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {isSignUp && (
                <div className="space-y-1">
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                          : "border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                      }`}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p
                      id="confirmPassword-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-medium py-3 px-4 rounded-xl transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isSubmitting}
                className="ml-1 text-blue-600 dark:text-blue-400 font-medium hover:underline focus:outline-none"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </div>

          {/* Visual Section */}
          <div className="hidden md:block md:w-1/2 relative bg-gradient-to-br from-primary to-primary-dark">
            <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
              <div className="max-w-xs">
                <h3 className="text-3xl font-bold mb-3">Join our community</h3>
                <p className="opacity-90">
                  {isSignUp
                    ? "Start your journey with us today"
                    : "Welcome back to your creative space"}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Signup_Form.png?raw=true')] bg-cover bg-center"></div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AuthModal;
