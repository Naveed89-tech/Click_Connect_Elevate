// components/admin/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Tags,
  Users,
  BarChart2,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  { name: "Products", path: "/admin/products", icon: <Boxes size={20} /> },
  { name: "Categories", path: "/admin/categories", icon: <Tags size={20} /> },
  { name: "Customers", path: "/admin/customers", icon: <Users size={20} /> },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: <BarChart2 size={20} />,
  },
  {
    name: "Notifications",
    path: "/admin/notifications",
    icon: <Bell size={20} />,
  },
  { name: "Accounts", path: "/admin/accounts", icon: <Users size={20} /> },
  { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-full bg-white border-r px-4 py-6">
      <div className="text-2xl font-bold mb-8">Spodut</div>
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-100 text-sm font-medium ${
              location.pathname === item.path ? "bg-gray-200" : ""
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium w-full">
          <LogOut size={20} /> Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
