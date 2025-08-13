import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'

function RoleDetail() {
  const { id } = useParams()
  const [role, setRole] = useState(null)
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
  }, [id, accessToken])

  useEffect(()=>{
    const fetchPermissions =  async () => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/get-permissions`,{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const data =await res.data.data.permissions
             const filtered = data.filter(item => item.roleId._id === id)
             
             setPermissions(filtered)
            
        }catch(e){
            console.error(e);            
        }
    }
    fetchPermissions()
  },[id,accessToken])

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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
          Permissions for Role: <span className="text-blue-600">{role.name.toUpperCase()}</span>
        </h1>
        <p className="text-gray-600 mb-6">
          Below are the details and permissions associated with this role. You can manage role permissions from here.
        </p>

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
            </tr>
            </thead>
            <tbody>
            {permissions?.length ? (
                permissions.map((perm) => {
                const actions = ["read", "add", "edit", "delete"];
                const hasAll = actions.every(action => perm.permissions.includes(action));
                
                return (
                    <tr key={perm._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 capitalize">
                        {perm.pageId ? perm.pageId.name : "No page assigned"}
                    </td>
                    {actions.map((action) => (
                        <td key={action} className="px-4 py-2 text-center">
                        {perm.permissions.includes(action) ? (
                            <span className="text-green-600 font-semibold">✔</span>
                        ) : (
                            <span className="text-red-500 font-semibold">✘</span>
                        )}
                        </td>
                    ))}
                    <td className="px-4 py-2 text-center">
                        {hasAll ? (
                        <span className="text-green-600 font-semibold">✔</span>
                        ) : (
                        <span className="text-red-500 font-semibold">✘</span>
                        )}
                    </td>
                    </tr>
                );
                })
            ) : (
                <tr>
                <td colSpan="6" className="text-center text-gray-400 py-4">
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
