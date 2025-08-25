import  { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SquarePen, Trash2 } from 'lucide-react';
import { addRole, deleteRole, fetchRoles, updateRole } from './auth/rolesSlice';
import { useDispatch, useSelector } from 'react-redux';

function Roles() {
const dispatch = useDispatch();
  const { items: roles, loading, error } = useSelector((state) => state.roles);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description:""
  });
  const [editRoles, setEditRoles] = useState({
    name: "",
    description:""
  });
  const { accessToken } = JSON.parse(localStorage.getItem('auth'));

  useEffect(() => {
    dispatch(fetchRoles(accessToken));
  }, [dispatch, accessToken]);

  const handleAdd = () =>
  {
    setShowModal(true);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addRole({ newRole, token: accessToken }));
    setNewRole({ name: "", description: "" });
    setShowModal(false);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      dispatch(deleteRole({ id, token: accessToken }));
    }
  };
  const editRole = (role) => {
    setEditRoles({ name: role.name, description: role.description, _id: role._id });
    setShowEditModal(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    dispatch(updateRole({ updatedRole: editRoles, token: accessToken }));
    setEditRoles({ name: "", description: "", _id: "" });
    setShowEditModal(false);
  };

  if(loading) return <div className="text-center mt-16 text-gray-500">Loading Roles...</div>;
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Roles List</h2>
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          Add Role
        </button>
      </div>

  <div className="overflow-x-auto rounded shadow">
  <table className="min-w-full bg-white border-collapse">
    <thead className="bg-gray-700 text-white text-left">
      <tr>
        <th className="px-4 py-3 text-sm sm:text-lg font-semibold">Name</th>
        <th className="px-4 py-3 text-sm sm:text-lg font-semibold hidden sm:table-cell">Description</th>
        <th className="px-4 py-3 text-sm sm:text-lg font-semibold">Actions</th>
      </tr>
    </thead>
    <tbody>
      {roles.length > 0 ? (
        roles.map((role) => (
          <tr key={role._id} className="border-b hover:bg-gray-50">
            {/* Name */}
            <td className="px-4 py-3 text-gray-800 text-sm sm:text-base">
              <Link
                to={`/admin/role-detail/${role._id}`}
                className="text-blue-600 font-bold hover:underline"
              >
                {role.name.toUpperCase()}
              </Link>
              <div className="sm:hidden text-gray-600 mt-1 text-sm">
                {role.description}
              </div>
            </td>

            <td className="px-4 py-3 capitalize text-gray-800 text-md sm:text-base hidden sm:table-cell">
              {role.description}
            </td>

            <td className="px-4 py-4 flex flex-wrap gap-2">
              <button
                onClick={() => editRole(role)}
                className="bg-yellow-600 hover:bg-yellow-800 p-2 rounded text-white font-medium"
              >
                <SquarePen />
              </button>
              <button
                onClick={() => handleDelete(role._id)}
                className="text-white bg-red-600 hover:bg-red-800 p-2 rounded font-medium"
              >
               <Trash2/>
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="3" className="px-4 py-4 text-center text-gray-500 text-sm sm:text-base">
            No roles found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

       {showModal && (
        <div  className="fixed inset-0 bg-black-500/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">Add New Role</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Role name"
                value={newRole.name}
                onChange={(e) => setNewRole({...newRole,name:e.target.value})}
                className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Role Description"
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole,description:e.target.value})}
                className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       {showEditModal && (
        <div  className="fixed inset-0 bg-black-500/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">Add New Role</h3>
            <form onSubmit={handleEdit}>
              <input
                type="text"
                placeholder="Role name"
                value={editRoles.name}
                onChange={(e) => setEditRoles({...editRoles,name:e.target.value})}
                className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Role Description"
                value={editRoles.description}
                onChange={(e) => setEditRoles({...editRoles,description:e.target.value})}
                className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roles;
