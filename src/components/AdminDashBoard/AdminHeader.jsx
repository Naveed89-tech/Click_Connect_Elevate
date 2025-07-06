import { useState } from "react";

import { FiMenu } from "react-icons/fi";

const AdminHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      </div>
    </header>
  );
};

export default AdminHeader;
