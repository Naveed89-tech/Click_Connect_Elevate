// pages/admin/Customers.jsx
import React from "react";

const Customers = () => {
  const customers = [
    { name: "Ali Khan", email: "ali@example.com", orders: 5, status: "Active" },
    {
      name: "Sarah Malik",
      email: "sarah@example.com",
      orders: 2,
      status: "Inactive",
    },
    {
      name: "Usman Tariq",
      email: "usman@example.com",
      orders: 7,
      status: "Active",
    },
    {
      name: "Ayesha Noor",
      email: "ayesha@example.com",
      orders: 1,
      status: "Active",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Customer List
      </h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Orders</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2">{cust.name}</td>
              <td className="py-2">{cust.email}</td>
              <td className="py-2">{cust.orders}</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cust.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {cust.status}
                </span>
              </td>
              <td className="py-2">
                <button className="text-blue-600 hover:underline text-xs mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:underline text-xs">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
