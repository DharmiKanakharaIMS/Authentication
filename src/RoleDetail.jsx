import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Switch } from '@mui/material'

function RoleDetail() {
  const { id } = useParams()
  const [role, setRole] = useState(null)
  const [pages, setPages] = useState(null)
  const { accessToken } = JSON.parse(localStorage.getItem('auth'))
   const [permissions, setPermissions] = useState([])

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

  useEffect(()=>{
    const fetchPermissions =  async () => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/get-permissions`,{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const data = await res.data.data.permissions
             const filtered = data.filter(item => item.roleId._id === id)
             
             setPermissions(filtered)
            
        }catch(e){
            console.error(e);            
        }
    }
    fetchPermissions()
  },[])

  useEffect(()=>{
    const fetchPages = async() => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/get-pages`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data = await res.data.data.pages
        setPages(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPages()
  },[id,accessToken])

  const handlePageAdd =async (e) =>{
    const pageName = e.target.value;
  if (!pageName) return;

    try {
    // Find the selected page object
    const selectedPage = pages.find((p) => p.name === pageName);
    console.log(selectedPage);
    

    if (!selectedPage) return;

    // API request to add permission mapping
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/permissions`,
      {
        roleId: id,
        pageId: selectedPage._id,
        permissions: [], 
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Update permissions state immediately
   setPermissions((prev) => [
  ...prev,
  {
    ...res.data.data.permission,
    pageId: selectedPage, // attach full page object so name shows
  },
]);

    alert(`Page "${selectedPage.name}" added successfully!`);
  } catch (err) {
    console.error("Error adding page:", err);
    alert("Failed to add page");
  }
  }

  const handleDelete = async (permId) => {
  try {
    // Optimistically update UI (remove row immediately)
    setPermissions((prev) => prev.filter((p) => p._id !== permId));

    // API call
    await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/permissions/${permId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    toast.success("Permission deleted successfully!");
  } catch (err) {
    console.error("Error deleting permission:", err);
    toast.error("Failed to delete permission");

    // Rollback UI (restore deleted item if API fails)
    setPermissions((prev) => [...prev, permissions.find((p) => p._id === permId)]);
  }
};

const handlePermissionToggle = async (perm, action) => {
  try {
    let newPermissions = perm.permissions.includes(action)
      ? perm.permissions.filter((p) => p !== action)
      : [...perm.permissions, action];

    // Optimistic UI update
    setPermissions((prev) =>
      prev.map((p) =>
        p._id === perm._id ? { ...p, permissions: newPermissions } : p
      )
    );

    // API call
    await axios.put(
      `${import.meta.env.VITE_BASE_URL}/permissions/${perm._id}`,
      { permissions: newPermissions },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (err) {
    console.error("Error updating permission:", err);
  }
};
const handleToggleAll = async (perm, enableAll,actions) => {
  try {
    // ✅ If true → give ALL actions, if false → clear all
    const newPermissions = enableAll ? actions : [];

    // Optimistic UI update
    setPermissions((prev) =>
      prev.map((p) =>
        p._id === perm._id ? { ...p, permissions: newPermissions } : p
      )
    );

    // API call
    await axios.put(
      `${import.meta.env.VITE_BASE_URL}/permissions/${perm._id}`,
      { permissions: newPermissions },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (err) {
    console.error("Error toggling all permissions:", err);
  }
};

  if (!role) return <div className="text-center mt-16 text-gray-500">Loading...</div>

  return (
    <div className="p-6 sm:p-8 min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/admin/roles"
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Roles
        </Link>
      </div>

      {/* Role Card */}
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
              value={""}
              onChange={handlePageAdd}
              className='w-full px-3 py-2 border rounded-md capitalize'>
                  <option value="" disabled hidden>Add Page</option>
                  {
                   pages && pages.map((page)=>(
                      <option key={page._id} value={page.name}>{page.name}</option>
                    ))
                  }
                </select>                
        </div>
        </div>

        {/* Example Permissions List */}
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
                        {/* {perm.permissions.includes(action) ? (
                            <span className="text-green-600 font-semibold">✔</span>
                        ) : (
                            <span className="text-red-500 font-semibold">✘</span>
                        )} */}
                        </td>
                    ))}
                    <td className="px-4 py-2 text-center">
                      <Switch
                        checked={actions.every((a) => perm.permissions.includes(a))}
                        onChange={(e) => handleToggleAll(perm, e.target.checked,actions)} // get true/false
                      />
                        {/* {hasAll ? (
                        <span className="text-green-600 font-semibold">✔</span>
                        ) : (
                        <span className="text-red-500 font-semibold">✘</span>                        
                        )} */}                       
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
