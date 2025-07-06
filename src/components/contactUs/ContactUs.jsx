import { useState } from 'react';

import {
  getApps,
  initializeApp,
} from 'firebase/app';
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

/* ───────────── Firebase bootstrapping (unchanged) ───────────── */
const firebaseConfig = {
  apiKey: "AIzaSyAF8WEDnLiu7_b3G3br8CMsBFAPxPz1DI8",
  authDomain: "clickconnectelevate.firebaseapp.com",
  projectId: "clickconnectelevate",
  storageBucket: "clickconnectelevate.appspot.com",
  messagingSenderId: "394779325425",
  appId: "1:394779325425:web:727c5156956f2c63c7ca50",
};
if (getApps().length === 0) initializeApp(firebaseConfig);
const db = getFirestore();

/* ───────────── Contact component ───────────── */
const ContactPage = () => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ---------- validation helper (unchanged) ---------- */
  const validate = (f) => {
    const e = {};
    if (!f.firstName) e.firstName = "First name is required.";
    if (!f.lastName) e.lastName = "Last name is required.";
    if (!f.email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      e.email = "Enter a valid email address.";
    if (!f.message) e.message = "Message is required.";
    return e;
  };

  /* ---------- submit handler (fixed) ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fields = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
    };

    // Mark all fields as touched before validation
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      message: true,
    });

    const v = validate(fields);
    setErrors(v);

    if (Object.keys(v).length === 0) {
      try {
        /* Firestore archive */
        await addDoc(collection(db, "contactMessages"), {
          ...fields,
          createdAt: serverTimestamp(),
          status: "open",
        });

        /* native POST → FormSubmit (sends email) */
        toast.success("Thanks! Your message was sent.");
        form.submit(); // sends to FormSubmit
      } catch (err) {
        console.error("Firestore error:", err);
        toast.error("Sorry, message could not be sent.");
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => {
      const newErrors = validate({ [name]: value });
      return { ...p, [name]: newErrors[name] };
    });
  };

  const inputClass = (n) =>
    `border-b p-2 outline-none bg-transparent w-full ${
      touched[n] && errors[n]
        ? "border-red-500"
        : touched[n] && !errors[n]
        ? "border-green-500"
        : "border-gray-400"
    }`;

  /* ───────────── JSX (all styles preserved) ───────────── */
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-Rubik">
      {/* Left Art Section (unchanged) */}
      <div className="bg-[#1a1a1a] text-white px-6 py-12 md:px-10 md:py-16 md:w-1/2">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif mb-6">
            We'd love to
            <br />
            hear from you
          </h1>
          <div className="flex justify-center items-center mt-10 md:mt-20 space-x-4 md:space-x-8">
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-secondary md:translate-x-[70px]"></div>
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-white border-dashed"></div>
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-secondary md:-translate-x-[70px]"></div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="bg-background px-6 py-12 md:px-10 md:py-16 text-[#1a1a1a] md:w-1/2">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl md:text-2xl font-bold font-Rubik mb-6 text-primary">
            Contact us
          </h2>

          {/* FormSubmit configuration added to <form> only */}
          <form
            className="space-y-6"
            action="https://formsubmit.co/naveed5651@gmail.com"
            method="POST"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* FormSubmit extras (hidden) */}
            <input type="text" name="_honey" className="hidden" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value={window.location.href} />

            {/* --- inputs identical to your original --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  name="firstName"
                  onBlur={handleBlur}
                  type="text"
                  placeholder="First name"
                  className={inputClass("firstName")}
                />
                {touched.firstName && errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <input
                  name="lastName"
                  onBlur={handleBlur}
                  type="text"
                  placeholder="Last name"
                  className={inputClass("lastName")}
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  name="email"
                  onBlur={handleBlur}
                  type="email"
                  placeholder="Enter your email"
                  className={inputClass("email")}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number (optional)"
                  className="border-b border-gray-400 bg-transparent p-2 outline-none w-full"
                />
              </div>
            </div>

            <div>
              <textarea
                name="message"
                onBlur={handleBlur}
                placeholder="Enter your message"
                rows={4}
                className={inputClass("message")}
              />
              {touched.message && errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="text-sm border-b border-black pb-1 hover:translate-x-1 transition-transform hover:cursor-pointer"
            >
              Submit →
            </button>
          </form>

          <div className="mt-8 md:mt-12 text-sm">
            <p>EMAIL US</p>
            <a
              href="mailto:naveed5651@gmail.com"
              className="text-gray-600 hover:underline"
            >
              enquiries&#64;gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
