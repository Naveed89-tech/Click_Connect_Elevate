import { FiHome, FiShoppingBag, FiDollarSign, FiUsers, FiPieChart, FiSettings } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <nav className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Store</h2>
      </div>

      <ul className="space-y-2 flex-1">
        <li>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <FiHome className="mr-3" />
            Dashboards
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <FiShoppingBag className="mr-3" />
            Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <FiDollarSign className="mr-3" />
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <FiUsers className="mr-3" />
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <FiPieChart className="mr-3" />
            Analytics
          </NavLink>
        </li>
      </ul>

      <div className="pt-4 border-t border-gray-700">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg transition-colors ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          <FiSettings className="mr-3 " />
          Settings
        </NavLink>
      </div>
    </nav>
  );
};

export default AdminSidebar;