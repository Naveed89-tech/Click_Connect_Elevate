import { useState } from "react";

import { FiBell, FiMenu, FiSearch } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext"; // Assumed path to your auth context

const AdminHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth(); // Destructure currentUser from your auth context

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FiMenu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full">
              <FiBell className="h-6 w-6" />
            </button>
            {/* Notification Dot */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-pulse ring-2 ring-white"></span>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-2">
            <img
              src={
                currentUser?.photoURL ||
                `https://ui-avatars.com/api/?name=${
                  currentUser?.displayName || "Admin"
                }&background=0D8ABC&color=fff`
              }
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              {currentUser?.displayName || "Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
