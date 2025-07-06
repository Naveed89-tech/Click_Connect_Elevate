import React, {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiCalendar,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiUser,
} from 'react-icons/fi';
import {
  Link,
  useParams,
} from 'react-router-dom';

import { db } from '../../firebase';
import UserOrdersTable from './UserOrdersTable';

const UserProfileData = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user document
        const userDoc = await getDoc(doc(db, "users", userId));

        if (!userDoc.exists()) {
          throw new Error("User not found");
        }

        const userData = userDoc.data();

        // Get user's addresses
        const addressesRef = collection(db, "users", userId, "addresses");
        const addressesSnapshot = await getDocs(addressesRef);
        const addresses = addressesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Get user's orders
        const ordersRef = collection(db, "orders");
        const ordersQuery = query(
          ordersRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate() || null,
        }));

        setUser({
          id: userDoc.id,
          ...userData,
          addresses,
          orders,
          createdAt: userData.createdAt?.toDate() || null,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto mt-8">
        <div className="text-red-500 font-medium text-lg mb-4">{error}</div>
        <Link
          to="/admin/users"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Back button */}
      <Link
        to="/admin/users"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <FiArrowLeft className="mr-1" /> Back to all users
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          User Profile: {user.displayName || user.email?.split("@")[0]}
        </h1>

        <div className="flex gap-2">
          <Link
            to={`/admin/users/${userId}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* User info card */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
              <FiUser className="h-8 w-8 text-gray-600" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {user.displayName || "No name provided"}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <FiMail className="mr-2 text-gray-400" />
                    {user.email}
                  </div>
                </div>

                <div className="mt-2 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ml-2 ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <FiPhone className="mr-2 text-gray-400" />
                  {user.phone || "No phone number"}
                </div>

                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2 text-gray-400" />
                  Joined:{" "}
                  {user.createdAt
                    ? format(user.createdAt, "MMMM d, yyyy")
                    : "Unknown"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{user.orders?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold">
                $
                {user.orders
                  ?.reduce((sum, order) => sum + (order.total || 0), 0)
                  .toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Order</p>
              <p className="text-2xl font-bold">
                {user.orders?.length
                  ? format(new Date(user.orders[0].date), "MMM d, yyyy")
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="p-6">
          {user.orders?.length ? (
            <UserOrdersTable orders={user.orders} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No orders found</p>
              <Link
                to={`/admin/orders?user=${user.id}`}
                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                View all orders
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Addresses preview */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Saved Addresses
            </h3>
            <Link
              to={`/admin/users/${userId}/addresses`}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              View all addresses
            </Link>
          </div>
        </div>
        <div className="p-6">
          {user.addresses?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.slice(0, 2).map((address, index) => (
                <div key={address.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {address.label || `Address ${index + 1}`}
                    {address.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </h4>
                  <p className="text-gray-600">
                    {address.full ||
                      [
                        address.street,
                        address.city,
                        address.state,
                        address.postalCode,
                        address.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No saved addresses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileData;
