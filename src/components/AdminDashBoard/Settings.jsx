import { FiSave, FiInfo, FiAlertTriangle } from "react-icons/fi";
import { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: "My E-commerce Store",
    storeEmail: "contact@myecommercestore.com",
    storeCurrency: "USD",
    maintenanceMode: false,
    enableTaxes: true,
    taxRate: 7.5,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your store configuration and preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Settings Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiInfo className="mr-2 text-blue-500" />
              General Settings
            </h2>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="storeEmail"
                  value={settings.storeEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="storeCurrency"
                  value={settings.storeCurrency}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                </select>
              </div>

              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="maintenanceMode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maintenance Mode
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    When enabled, your store will be temporarily unavailable to
                    customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Settings Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiInfo className="mr-2 text-blue-500" />
              Tax Configuration
            </h2>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="enableTaxes"
                  name="enableTaxes"
                  checked={settings.enableTaxes}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label
                  htmlFor="enableTaxes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enable Tax Calculation
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically calculate taxes for all orders
                </p>
              </div>
            </div>

            {settings.enableTaxes && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="taxRate"
                      value={settings.taxRate}
                      onChange={handleChange}
                      min="0"
                      max="50"
                      step="0.1"
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone Card */}
        {settings.maintenanceMode && (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 border border-red-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-red-50">
              <h2 className="text-lg font-semibold text-red-800 flex items-center">
                <FiAlertTriangle className="mr-2 text-red-600" />
                Maintenance Mode Active
              </h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-red-700">
                Your store is currently in maintenance mode and not accessible
                to customers. Disable this setting when you're ready to reopen
                your store.
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <FiSave className="mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
