import React from "react";
import { Bell, Search } from "lucide-react";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 border-b">
      <h1 className="text-xl font-semibold">Products</h1>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Search size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} />
        </button>
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className="w-9 h-9 rounded-full"
        />
      </div>
    </div>
  );
};

export default Topbar;
