// pages/admin/Accounts.jsx
import React, { useState } from "react";

const Accounts = () => {
  const [users, setUsers] = useState([
    {
      name: "Admin",
      role: "Administrator",
      email: "admin@example.com",
      status: "Active",
    },
    {
      name: "Editor",
      role: "Content Editor",
      email: "editor@example.com",
      status: "Active",
    },
    {
      name: "Ali Merchant",
      role: "Merchant",
      email: "ali@shop.com",
      status: "Pending",
    },
    {
      name: "Zara Saleem",
      role: "Seller",
      email: "zara@sellnow.com",
      status: "Blocked",
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Merchant",
    status: "Pending",
  });
  const roles = ["Administrator", "Editor", "Merchant", "Seller", "Viewer"];

  const handleRoleChange = (index, newRole) => {
    const updatedUsers = [...users];
    updatedUsers[index].role = newRole;
    setUsers(updatedUsers);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedUsers = [...users];
    updatedUsers[index].status = newStatus;
    setUsers(updatedUsers);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsers([...users, newUser]);
    setNewUser({ name: "", email: "", role: "Merchant", status: "Pending" });
  };

  const handleSave = () => {
    alert(
      "All changes have been saved (simulated). Ready for Firebase integration."
    );
    console.log("Saved Users:", users);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Manage Accounts
      </h2>

      <form
        onSubmit={handleAddUser}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleNewUserChange}
          required
          className="px-3 py-2 border rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleNewUserChange}
          required
          className="px-3 py-2 border rounded-md"
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleNewUserChange}
          className="px-3 py-2 border rounded-md"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add User
        </button>
      </form>

      <table className="min-w-full text-sm mb-4">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2">{user.name}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                  className="px-2 py-1 border rounded-md"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2">
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                  className={`px-2 py-1 rounded-md ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : user.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </td>
              <td className="py-2">
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:underline text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Accounts;
