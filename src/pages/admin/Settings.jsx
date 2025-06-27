// pages/admin/Settings.jsx
import React, { useState } from "react";

const Settings = () => {
  const [toggles, setToggles] = useState({
    emailNotifications: true,
    smsAlerts: false,
    desktopNotifications: true,
    codEnabled: true,
  });

  const handleToggle = (field) => {
    setToggles((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="p-6 space-y-8 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800">Settings</h2>

      {/* Personal Information */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 text-red-400">
          1. Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="email"
            placeholder="Contact Email"
            className="px-3 py-2 border rounded-md"
          />
          <input type="file" accept="image/*" className="col-span-2" />
          <input
            type="password"
            placeholder="Change Password"
            className="px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Notification Preferences */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          2. Notification Preferences
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={toggles.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={toggles.smsAlerts}
              onChange={() => handleToggle("smsAlerts")}
            />
            SMS Alerts
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={toggles.desktopNotifications}
              onChange={() => handleToggle("desktopNotifications")}
            />
            Desktop Notifications
          </label>
        </div>
      </div>

      {/* Store Configuration */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          3. Store Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Store Name"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="file"
            accept="image/*"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Currency (e.g. USD)"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Timezone (e.g. GMT+5)"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Business Hours"
            className="col-span-2 px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Tax & Shipping Settings */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          4. Tax & Shipping Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tax Rates"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Shipping Zones"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Delivery Time Estimates"
            className="col-span-2 px-3 py-2 border rounded-md"
          />
        </div>
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={toggles.codEnabled}
            onChange={() => handleToggle("codEnabled")}
          />
          Enable Cash on Delivery
        </label>
      </div>

      {/* Activity Logs & Marketing */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          5. Logs & Marketing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Activity Logs Tool (e.g. LogRocket)"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Email Marketing Tool (e.g. Mailchimp)"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Analytics Platform (e.g. Google Analytics)"
            className="col-span-2 px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Security Settings */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          6. Security Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Login Security (2FA or Auth App)"
            className="px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
