/* ------------------------------------------------------------------ */
/*  CustomersList.jsx – Complete User Management System               */
/* ------------------------------------------------------------------ */
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { format } from 'date-fns';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import {
  FiDollarSign,
  FiKey,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSearch,
  FiSliders,
  FiTrash2,
  FiUser,
  FiUserCheck,
  FiUserX,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import {
  auth,
  db,
} from '../../firebase';

const CustomersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    orders: "all",
  });

  /* ---------------------------- Fetch customers --------------------------- */
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);

        const ordersRef = collection(db, "orders");
        const ordersSnapshot = await getDocs(
          query(ordersRef, orderBy("createdAt", "desc"))
        );

        const map = new Map();

        /* Users → create base rows */
        for (const u of usersSnapshot.docs) {
          const data = u.data();
          const uid = u.id;

          /* first (optional) saved address */
          let address = "";
          try {
            const addrSnap = await getDocs(
              collection(db, "users", uid, "addresses")
            );
            if (!addrSnap.empty) {
              const a = addrSnap.docs[0].data();
              address = a.full || a.address || "";
            }
          } catch (err) {
            console.warn("addr fetch fail:", uid, err);
          }

          map.set(uid, {
            id: uid,
            name: data.displayName || data.email?.split("@")[0] || "Anonymous",
            email: data.email || "no-email@example.com",
            phone: data.phone || "",
            role: data.role || "user",
            active: data.active !== false, // default to true if not set
            address,
            orders: 0,
            totalSpent: 0,
            lastOrder: "No orders yet",
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        }

        /* Orders → aggregate stats */
        for (const o of ordersSnapshot.docs) {
          const order = o.data();
          const uid = order.userId || `guest_${o.id}`;

          if (!map.has(uid)) {
            map.set(uid, {
              id: uid,
              name: order.userName || `Customer ${uid.slice(0, 6)}`,
              email: order.userEmail || "no-email@example.com",
              phone: order.phone || "",
              role: "user",
              active: true,
              address: order.address || "",
              orders: 0,
              totalSpent: 0,
              lastOrder: "No orders yet",
              createdAt: order.createdAt?.toDate() || new Date(),
            });
          }

          const c = map.get(uid);
          c.orders += 1;
          c.totalSpent += parseFloat(order.total) || 0;

          if (order.createdAt) {
            const d = format(order.createdAt.toDate(), "yyyy-MM-dd");
            if (c.lastOrder === "No orders yet" || d > c.lastOrder) {
              c.lastOrder = d;
            }
          }
        }

        setCustomers(Array.from(map.values()));
      } catch (err) {
        console.error("Firestore error:", err);
        setError("Failed to load customer data. Please check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  /* ------------------------------ Delete user ----------------------------- */
  const handleDelete = async (cust) => {
    if (!window.confirm(`Delete ${cust.name}? This action is irreversible.`)) {
      return;
    }

    setDeletingId(cust.id);
    try {
      /* 1. delete primary user doc */
      await deleteDoc(doc(db, "users", cust.id));

      /* 2. delete addresses sub-collection */
      const addrSnap = await getDocs(
        collection(db, "users", cust.id, "addresses")
      );
      const promises = addrSnap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(promises);

      /* 3. update UI */
      setCustomers((prev) => prev.filter((c) => c.id !== cust.id));
      toast.success(`${cust.name} removed.`);
    } catch (err) {
      console.error("delete failed:", err);
      toast.error("Could not delete customer. See console.");
    } finally {
      setDeletingId(null);
    }
  };

  /* --------------------------- Toggle user active ------------------------- */
  const handleToggleActive = async (userId, currentStatus) => {
    setUpdatingId(userId);
    try {
      await updateDoc(doc(db, "users", userId), {
        active: !currentStatus,
      });

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === userId ? { ...c, active: !currentStatus } : c
        )
      );

      toast.success(`User ${currentStatus ? "suspended" : "activated"}`);
    } catch (err) {
      console.error("status update failed:", err);
      toast.error("Could not update user status");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------------------- Change user role -------------------------- */
  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });

      setCustomers((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, role: newRole } : c))
      );

      toast.success("Role updated");
    } catch (err) {
      console.error("role update failed:", err);
      toast.error("Could not update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  /* --------------------------- Reset password ---------------------------- */
  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`Password reset email sent to ${email}`);
    } catch (err) {
      console.error("password reset failed:", err);
      toast.error("Could not send reset email");
    }
  };

  /* -------------------------- Search / filter logic ------------------------ */
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Search term filter
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.phone && c.phone.includes(searchTerm));

      // Role filter
      const matchesRole = filters.role === "all" || c.role === filters.role;

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && c.active) ||
        (filters.status === "inactive" && !c.active);

      // Orders filter
      const matchesOrders =
        filters.orders === "all" ||
        (filters.orders === "none" && c.orders === 0) ||
        (filters.orders === "some" && c.orders > 0 && c.orders < 5) ||
        (filters.orders === "many" && c.orders >= 5);

      return matchesSearch && matchesRole && matchesStatus && matchesOrders;
    });
  }, [customers, searchTerm, filters]);

  /* --------------------------- Format address ---------------------------- */
  const asAddressString = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;

    // object → pick "full" if provided, else join primitive fields
    if (addr.full) return addr.full;
    return Object.values(addr)
      .filter((v) => typeof v === "string" && v.trim() !== "")
      .join(", ");
  };

  /* ------------------------------- Render UI ------------------------------ */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading customer data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto mt-8">
        <div className="text-red-500 font-medium text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header + search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Customers Management
        </h1>
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center mb-2">
          <FiSliders className="mr-2 text-gray-500" />
          <h3 className="font-medium text-gray-700">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Role filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Orders filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orders
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={filters.orders}
              onChange={(e) =>
                setFilters({ ...filters, orders: e.target.value })
              }
            >
              <option value="all">All Orders</option>
              <option value="none">No Orders</option>
              <option value="some">1-4 Orders</option>
              <option value="many">5+ Orders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    {/* Avatar + name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {c.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: #{c.id.slice(-4).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center">
                          <FiMail className="mr-2 text-gray-400" />
                          {c.email}
                        </div>
                        {c.phone && (
                          <div className="flex items-center">
                            <FiPhone className="mr-2 text-gray-400" />
                            {c.phone}
                          </div>
                        )}
                        {c.address && (
                          <div className="flex items-start">
                            <FiMapPin className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-xs">
                              {asAddressString(c.address)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={c.role}
                        onChange={(e) => handleRoleChange(c.id, e.target.value)}
                        disabled={updatingId === c.id}
                        className="border rounded px-2 py-1 text-sm disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(c.id, c.active)}
                        disabled={updatingId === c.id}
                        className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                          c.active
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        } disabled:opacity-50`}
                      >
                        {c.active ? (
                          <>
                            <FiUserCheck className="inline" /> Active
                          </>
                        ) : (
                          <>
                            <FiUserX className="inline" /> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Orders / spent / last order */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {c.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiDollarSign className="mr-2 text-gray-400" />
                        {c.totalSpent.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {c.lastOrder}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/admin/users/${c.id}/profileData`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-900 hover:underline p-1"
                        title="View profile"
                      >
                        <FiUser className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/users/${c.id}/addresses`}
                        className="inline-flex items-center text-green-600 hover:text-green-800 p-1"
                        title="View addresses"
                      >
                        <FiMapPin className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleResetPassword(c.email)}
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 p-1"
                        title="Reset password"
                      >
                        <FiKey className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                        className="inline-flex items-center text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                        title="Delete customer"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <div className="text-gray-500">
                      {searchTerm ||
                      filters.role !== "all" ||
                      filters.status !== "all" ||
                      filters.orders !== "all" ? (
                        <>
                          <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2">
                            No customers match your filters
                          </p>
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setFilters({
                                role: "all",
                                status: "all",
                                orders: "all",
                              });
                            }}
                            className="mt-2 text-sm text-blue-600 hover:underline"
                          >
                            Clear all filters
                          </button>
                        </>
                      ) : (
                        <>
                          <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2">No customer data found</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersList;
