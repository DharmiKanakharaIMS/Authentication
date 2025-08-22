// Users.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SquarePen, Trash2 } from 'lucide-react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const {accessToken} = JSON.parse(localStorage.getItem('auth'))
  const nav = useNavigate()
 const [selectedUser, setSelectedUser] = useState(null);
   const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    qualification: "",
    technologies: "",
  })

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await res.data.data
        setUsers(data.users)
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      fetchUsers();
    } else {
      console.error("No access token found");
      setLoading(false);
    }
  }, [accessToken,users]);
  
const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "",
      qualification: user.qualification || "",
      technologies: user.technologies?.join(", ") || "",
    });
    setShowModal(true);
  };

 const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    const userId = selectedUser.id;
    const { role, technologies, ...rest } = formData;

    const body = {
      userId,
      ...rest,
      technologies: technologies.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/auth/update-profile`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const updatedUser = res.data.data;

      // Update local users state
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setShowModal(false);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

const handleDelete = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this user?");
  if (!confirmed) return;

  try {
    await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/auth/delete-user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { userId: id }, 
      }
    );

    setUsers((prev) => prev.filter((user) => user.id !== id));
    alert("User deleted successfully");
  } catch (err) {
    console.error("Error deleting user:", err);
    alert("Failed to delete user");
  }
};


  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
     <div className="flex justify-between mb-6">
         <h1 className="text-3xl font-bold  text-gray-800">Users List</h1>
         <button onClick={()=>nav('/admin/register')} className="bg-blue-600 font-semibold hover:bg-blue-700 text-white px-4 py-1 rounded shadow">Add User </button>
     </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
  <table className="min-w-full border-collapse bg-white rounded-lg overflow-hidden">
    <thead className="bg-indigo-600 text-white">
      <tr>
        <th className="py-2 px-2 sm:px-4 md:px-6 text-left text-sm sm:text-base md:text-md">Name</th>
        <th className="py-2 px-2 sm:px-4 md:px-6 text-left text-sm sm:text-base md:text-md">Email</th>
        <th className="py-2 px-2 sm:px-4 md:px-6 text-left text-sm sm:text-base md:text-md">Role</th>
        <th className="py-2 px-2 sm:px-4 md:px-6 text-left text-sm sm:text-base md:text-md">Qualification</th>
        <th className="py-2 px-2 sm:px-4 md:px-6 text-left text-sm sm:text-base md:text-md">Technologies</th>
        <th className="py-2 px-2 sm:px-4 md:px-6 text-left text-sm sm:text-base md:text-md">Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.length > 0 ? (
        users.map((user) => (
          <tr key={user.id} className="border-b hover:bg-gray-100 transition-colors">
            <td className="py-2 px-2 sm:px-4 md:px-6 text-sm sm:text-base md:text-md capitalize whitespace-nowrap">{user.name}</td>
            <td className="py-2 px-2 sm:px-4 md:px-6 text-sm sm:text-base md:text-md whitespace-nowrap">{user.email}</td>
            <td className="py-2 px-2 sm:px-4 md:px-6 text-sm sm:text-base md:text-md capitalize whitespace-nowrap">{user.role}</td>
            <td className="py-2 px-2 sm:px-4 md:px-6 text-sm sm:text-base md:text-md capitalize whitespace-nowrap">{user.qualification || "-"}</td>
            <td className="py-2 px-2 sm:px-4 md:px-6 text-sm sm:text-base md:text-md whitespace-nowrap">
              {user.technologies?.length > 0 ? user.technologies.join(", ") : "—"}
            </td>
            <td className="py-2 px-2 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg flex gap-2 flex-wrap">
              <button onClick={() => handleEditClick(user)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded transition-colors">
                <SquarePen />
              </button>
              <button onClick={() => handleDelete(user.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded transition-colors">
                <Trash2 />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center py-6 text-gray-500 text-sm sm:text-base md:text-lg">
            No users found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-3">
              {/* Name */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Name"
              />
              {/* Role - not editable */}
              <p className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600">
                {formData.role || "NA"}
              </p>
              {/* Email */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
              />
              {/* Phone */}
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Phone"
              />
              {/* Qualification */}
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Qualification"
              />
              {/* Technologies */}
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Technologies (comma separated)"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    
  );
}

export default Users;
