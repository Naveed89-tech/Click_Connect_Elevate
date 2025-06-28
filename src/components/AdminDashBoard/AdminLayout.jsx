import { Outlet } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <AdminHeader />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet /> {/* This renders the matched child route */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
