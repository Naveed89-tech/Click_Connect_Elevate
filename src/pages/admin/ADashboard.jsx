// pages/admin/Dashboard.jsx
import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#0088FE"];

const Dashboard = () => {
  const lineData = [
    { name: "January", Latest: 40, Popular: 24, Featured: 20 },
    { name: "February", Latest: 30, Popular: 13, Featured: 22 },
    { name: "March", Latest: 20, Popular: 98, Featured: 25 },
    { name: "April", Latest: 27, Popular: 39, Featured: 20 },
    { name: "May", Latest: 18, Popular: 48, Featured: 21 },
    { name: "June", Latest: 23, Popular: 38, Featured: 25 },
    { name: "July", Latest: 34, Popular: 43, Featured: 29 },
  ];

  const pieData = [
    { name: "Used Storage", value: 18.24 },
    { name: "System Storage", value: 6.5 },
    { name: "Available Storage", value: 9.15 },
  ];

  const barData = [
    { name: "Red", Hits: 30 },
    { name: "Aqua", Hits: 45 },
    { name: "Green", Hits: 60 },
    { name: "Yellow", Hits: 35 },
    { name: "Purple", Hits: 50 },
    { name: "Orange", Hits: 40 },
    { name: "Blue", Hits: 20 },
  ];

  const orders = [
    {
      id: "#122349",
      status: "Moving",
      operator: "Oliver Trag",
      location: "London, UK",
      distance: "485 km",
      start: "16:00, 10 NOV 2018",
      due: "08:00, 18 NOV 2018",
    },
    {
      id: "#122348",
      status: "Pending",
      operator: "Jacob Miller",
      location: "London, UK",
      distance: "360 km",
      start: "11:00, 10 NOV 2018",
      due: "04:00, 14 NOV 2018",
    },
    {
      id: "#122347",
      status: "Cancelled",
      operator: "George Wilson",
      location: "London, UK",
      distance: "340 km",
      start: "12:00, 22 NOV 2018",
      due: "06:00, 28 NOV 2018",
    },
    {
      id: "#122346",
      status: "Moving",
      operator: "William Aung",
      location: "London, UK",
      distance: "218 km",
      start: "15:00, 10 NOV 2018",
      due: "09:00, 14 NOV 2018",
    },
    {
      id: "#122345",
      status: "Pending",
      operator: "Harry Ryan",
      location: "London, UK",
      distance: "280 km",
      start: "15:00, 11 NOV 2018",
      due: "09:00, 17 NOV 2018",
    },
    {
      id: "#122344",
      status: "Pending",
      operator: "Michael Jones",
      location: "London, UK",
      distance: "218 km",
      start: "18:00, 12 OCT 2018",
      due: "06:00, 18 OCT 2018",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Welcome back, Admin
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="mb-2 font-semibold text-gray-700">Latest Hits</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <Line type="monotone" dataKey="Latest" stroke="#0088FE" />
              <Line type="monotone" dataKey="Popular" stroke="#FF8042" />
              <Line type="monotone" dataKey="Featured" stroke="#00C49F" />
              <XAxis dataKey="name" />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="mb-2 font-semibold text-gray-700">Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="Hits" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="mb-2 font-semibold text-gray-700">
            Storage Information
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={60} label>
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="mb-4 font-semibold text-gray-700">
            Notification List
          </h3>
          <ul className="space-y-4">
            <li className="text-sm">
              <strong>Jessica</strong> and 6 others sent you new{" "}
              <span className="text-blue-600">product updates</span>. Check new
              orders.
            </li>
            <li className="text-sm">
              <strong>Oliver Too</strong> and 6 others sent you existing{" "}
              <span className="text-blue-600">product updates</span>. Read more
              reports.
            </li>
            <li className="text-sm">
              <strong>Victoria</strong> and 6 others sent you{" "}
              <span className="text-blue-600">order updates</span>. Read order
              information.
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <h3 className="mb-4 font-semibold text-gray-700">Orders List</h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">ORDER NO.</th>
                <th className="py-2">STATUS</th>
                <th className="py-2">OPERATORS</th>
                <th className="py-2">LOCATION</th>
                <th className="py-2">DISTANCE</th>
                <th className="py-2">START DATE</th>
                <th className="py-2">EST DELIVERY DUE</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2">{order.id}</td>
                  <td className="py-2">{order.status}</td>
                  <td className="py-2">{order.operator}</td>
                  <td className="py-2">{order.location}</td>
                  <td className="py-2">{order.distance}</td>
                  <td className="py-2">{order.start}</td>
                  <td className="py-2">{order.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
