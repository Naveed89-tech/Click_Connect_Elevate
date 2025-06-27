import React, { useState } from "react";

const ContactPage = () => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (fields) => {
    const errs = {};
    if (!fields.firstName) errs.firstName = "First name is required.";
    if (!fields.lastName) errs.lastName = "Last name is required.";
    if (!fields.email) {
      errs.email = "Email is required.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(fields.email)) {
        errs.email = "Enter a valid email address.";
      }
    }
    if (!fields.message) errs.message = "Message is required.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const fields = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    setTouched({ firstName: true, lastName: true, email: true, message: true });
    if (Object.keys(validationErrors).length === 0) {
      alert("Form submitted successfully!");
      form.reset();
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, ...validate({ [name]: value }) }));
  };

  const inputClass = (name) =>
    `border-b p-2 outline-none bg-transparent w-full ${
      touched[name] && errors[name]
        ? "border-red-500"
        : touched[name] && !errors[name]
        ? "border-green-500"
        : "border-gray-400"
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-Rubik">
      {/* Left Art Section */}
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
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
              ></textarea>
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
            <mail className="text-gray-600">enquiries@gmail.com</mail>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;