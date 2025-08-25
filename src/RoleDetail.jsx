import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Switch } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addPagePermission, deletePermission, fetchPermissions, updatePermission } from './auth/permissionSlice'
import { fetchPages } from './auth/pagesSlice'

function RoleDetail() {
  const { id } = useParams()
  const [role, setRole] = useState(null)
  const [selectedPage, setSelectedPage] = useState("");
  const dispatch = useDispatch();
  const { accessToken } = JSON.parse(localStorage.getItem('auth'))

    const { items: permissions,loading } = useSelector(
    (state) => state.permissions
  );
  
  const { items: pages } = useSelector((state) => state.pages);

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/get-roles`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data = await res.data.data.roles
        setRole(data.find(role => role._id === id))
      } catch (err) {
        console.error(err)
      }
    }
    fetchRole()
  }, [])

  useEffect(() => {
    dispatch(fetchPermissions({ roleId: id, token: accessToken }));
  }, [id, accessToken, dispatch]);

useEffect(() => {
  dispatch(fetchPages(accessToken));
}, [accessToken, dispatch]);

const handlePageAdd = (e) => {
  const pageName = e.target.value;
  setSelectedPage(""); 
  if (!pageName) return;

  const selectedPage = pages.find((p) => p.name === pageName);
  if (selectedPage) {
    dispatch(addPagePermission({ roleId: id, page: selectedPage, token: accessToken }));
  }
};

const handleDelete = (permId) => {
  if (window.confirm("Are you sure you want to delete this permission?")) {
    dispatch(deletePermission({ permId, token: accessToken }));
  }
};
 const handlePermissionToggle = (perm, action) => {
    const newPermissions = perm.permissions.includes(action)
      ? perm.permissions.filter((p) => p !== action)
      : [...perm.permissions, action];

    dispatch(updatePermission({ permId: perm._id, permissions: newPermissions, token: accessToken }));
  };

 const handleToggleAll = (perm, enableAll, actions) => {
    const newPermissions = enableAll ? actions : [];
    dispatch(updatePermission({ permId: perm._id, permissions: newPermissions, token: accessToken }));
  };

  if (!role || loading) {
  return <div className="text-center mt-16 text-gray-500">Loading...</div>;
}


  return (
    <div className="p-6 sm:p-8 min-h-screen">
      <div className="mb-6">
        <Link
          to="/admin/roles"
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Roles
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8  mx-auto transition-transform hover:scale-[1.01]">
        <div className='flex justify-between'>
          <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
          Permissions for Role: <span className="text-blue-600">{role.name.toUpperCase()}</span>
        </h1>
        <p className="text-gray-600 mb-6">
          Below are the details and permissions associated with this role. You can manage role permissions from here.
        </p>
        </div>
        <div><select name="page"
              value={selectedPage}
              onChange={handlePageAdd}
              className='w-full px-3 py-2 border rounded-md capitalize'>
                  <option value="" disabled hidden>Add Page</option>
                  {
                    pages?.map((page)=>(
                      <option key={page._id} value={page.name}>{page.name}</option>
                    ))
                  }
                </select>                
        </div>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
            <tr>
                <th className="px-4 py-2 text-left">Page Name</th>
                <th className="px-4 py-2 text-center">View</th>
                <th className="px-4 py-2 text-center">Add</th>
                <th className="px-4 py-2 text-center">Edit</th>
                <th className="px-4 py-2 text-center">Delete</th>
                <th className="px-4 py-2 text-center">Allow All</th>
                <th className="px-4 py-2 text-center">Action</th>
            </tr>
            </thead>
            <tbody>
            {permissions?.length ? (
                permissions.map((perm) => {
                const actions = ["read", "create", "update", "delete"];
                if (!perm.pageId) return null;
                return (
                    <tr key={perm._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 capitalize">
                        {perm.pageId ? perm.pageId.name : "No page assigned"}
                    </td>
                    {actions.map((action) => (
                        <td key={action} className="px-4 py-2 text-center">
                           <Switch
                              checked={perm.permissions.includes(action)}
                              onChange={() => handlePermissionToggle(perm, action)}
                            />
                        </td>
                    ))}
                    <td className="px-4 py-2 text-center">
                      <Switch
                        checked={actions.every((a) => perm.permissions.includes(a))}
                        onChange={(e) => handleToggleAll(perm, e.target.checked,actions)} // get true/false
                      />                   
                    </td>
                    <td className='text-center'>
                      <button onClick={()=>handleDelete(perm._id)} className='bg-red-600 text-white p-1 rounded'><Trash2/></button>
                    </td>
                    </tr>
                );
                })
            ) : (
                <tr>
                <td colSpan="7" className="text-center text-gray-400 py-4">
                    No permissions assigned.
                </td>
                </tr>
            )}
            </tbody>
            </table>
            
        </div>



      </div>
    </div>
  )
}

export default RoleDetail
