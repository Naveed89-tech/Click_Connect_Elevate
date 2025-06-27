import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/admin/ASidebar";
import Topbar from "../../components/admin/ATopbar";
import Dashboard from "./ADashboard";
import ProductList from "./AProductlist";
import Categories from "./ACategories";
import Customers from "./Customers";
import Analytics from "./Analytics";
import Notifications from "./Notifications";
import Settings from "./Settings";
import ProductForm from "./ProductForm";
import CategoryForm from "./CategoryForm";
import Accounts from "./Accounts";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-4 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="categories" element={<Categories />} />
            <Route path="customers" element={<Customers />} />

            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="categories/add" element={<CategoryForm />} />
            <Route path="accounts" element={<Accounts />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
