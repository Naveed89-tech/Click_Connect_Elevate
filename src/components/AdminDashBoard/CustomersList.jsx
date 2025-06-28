import { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiDollarSign,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { format } from "date-fns";

const CustomersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);

        const ordersRef = collection(db, "orders");
        const ordersSnapshot = await getDocs(
          query(ordersRef, orderBy("createdAt", "desc"))
        );

        const customerMap = new Map();

        // 🔁 Loop through users
        for (const userDoc of usersSnapshot.docs) {
          const user = userDoc.data();
          const userId = userDoc.id;

          let userAddress = "";

          // 🔍 Fetch addresses subcollection (1st address only)
          try {
            const addressSnap = await getDocs(
              collection(db, "users", userId, "addresses")
            );
            if (!addressSnap.empty) {
              const addr = addressSnap.docs[0].data();
              userAddress = addr.full || addr.address || "";
            }
          } catch (err) {
            console.warn("Address fetch failed for user:", userId, err);
          }

          customerMap.set(userId, {
            id: userId,
            name: user.displayName || user.email?.split("@")[0] || "Anonymous",
            email: user.email || "no-email@example.com",
            phone: user.phone || "",
            address: userAddress,
            orders: 0,
            totalSpent: 0,
            lastOrder: "No orders yet",
          });
        }

        // 🧾 Aggregate order info
        for (const orderDoc of ordersSnapshot.docs) {
          const order = orderDoc.data();
          const userId = order.userId || `guest_${orderDoc.id}`;

          if (!customerMap.has(userId)) {
            customerMap.set(userId, {
              id: userId,
              name: order.userName || `Customer ${userId.slice(0, 6)}`,
              email: order.userEmail || "no-email@example.com",
              phone: order.phone || "",
              address: order.address || "",
              orders: 0,
              totalSpent: 0,
              lastOrder: "No orders yet",
            });
          }

          const customer = customerMap.get(userId);
          customer.orders += 1;
          customer.totalSpent += parseFloat(order.total) || 0;

          if (order.createdAt) {
            const date = format(order.createdAt.toDate(), "yyyy-MM-dd");
            if (
              customer.lastOrder === "No orders yet" ||
              date > customer.lastOrder
            ) {
              customer.lastOrder = date;
            }
          }
        }

        setCustomers(Array.from(customerMap.values()));
      } catch (err) {
        console.error("Firestore error:", err);
        setError("Failed to load customer data. Please check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm))
  );

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

      <div className="bg-white shadow rounded-lg overflow-hidden">
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
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: #{customer.id.slice(-4).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <FiMail className="mr-2 text-gray-400" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center">
                          <FiPhone className="mr-2 text-gray-400" />
                          {customer.phone}
                        </div>
                      )}
                      {customer.address && (
                        <div className="flex items-start">
                          <FiMapPin className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-xs">
                            {customer.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiDollarSign className="mr-2 text-gray-400" />
                      {customer.totalSpent.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.lastOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/customers/${customer.id}`}
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="text-gray-500">
                    {searchTerm ? (
                      <>
                        <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2">No customers match your search</p>
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
  );
};

export default CustomersList;
