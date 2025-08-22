import  { useEffect, useRef, useState } from "react";
import {
  Edit,
  LogOut,
  Mail,
  Phone,
  GraduationCap,
  Code2,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logoutUser, setUsers } from "./auth/authSlice";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [userData, setuserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    qualification: "",
    technologies: "",
    // profileImage: ""
  });



useEffect(() => {
  async function getUser() {
    try {
      // console.log("Fetching profile from:", `${import.meta.env.VITE_BASE_URL}/auth/get-profile`);
      // console.log("Token:", accessToken);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/get-profile`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      // console.log("Profile response:", res.data);

      const data = res.data.data;

      // const profileImage = data.profileImage?.startsWith("/uploads")
      //   ? `${import.meta.env.VITE_BASE_URL}${data.profileImage}`
      //   : data.profileImage;

      setUser({ ...data});
    } catch (err) {
      console.error("Error fetching user profile:", err.response?.data || err);
    }
  }
  if (accessToken) getUser();
}, [accessToken]);


  const handleEditClick = () => {
    setuserData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "",
      qualification: user.qualification || "",
      technologies: user.technologies?.join(", ") || "",
      // profileImage: user.profileImage || ""
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setuserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
   

const handleSave = async () => {
  const userId = user.userId || user.id || user._id;
  if (!userId) {
    alert("User ID not found");
    return;
  }

  const { role, technologies, ...rest } = userData;
  const body = {
    userId,
    ...rest,
    technologies: technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter((t) => t),
  };

  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/auth/update-profile`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const updatedUser = res.data.data;

    // Update local state so this component re-renders
    setUser(updatedUser);

    // Update Redux so the whole app has the latest user info
    dispatch(setUsers(updatedUser));


  } catch (err) {
    console.error("Error updating profile:", err);
  }finally{
    setShowModal(false)
  }
};
const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      try {
        await dispatch(logoutUser(accessToken));
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200 space-y-5">
        {/* Profile Image */}
       <div className="flex flex-col items-center">
      <img
        src={user.profileImage}
        alt={user.name || "Profile"}
        className="w-28 h-28 rounded-full border-4 border-white shadow-md mb-4 cursor-pointer"
        // onClick={handleImageClick} // 👈 click image to open file picker
      />
      {/* <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      /> */}
    </div>


        {/* Name */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <User size={18} /> Name
          </label>
          <div className="border rounded px-3 py-2 bg-gray-50">
            {user.name || "NA"}
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="font-medium text-gray-700">Role</label>
          <div className="border rounded px-3 py-2 bg-gray-50">
            {user.role || "NA"}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <Mail size={18} /> Email
          </label>
          <div className="border rounded px-3 py-2 bg-gray-50">
            {user.email || "NA"}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <Phone size={18} /> Phone
          </label>
          <div className="border rounded px-3 py-2 bg-gray-50">
            {user.phone || "NA"}
          </div>
        </div>

        {/* Qualification */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <GraduationCap size={18} /> Qualification
          </label>
          <div className="border rounded px-3 py-2 bg-gray-50">
            {user.qualification || "NA"}
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <Code2 size={18} /> Technologies
          </label>
          <div className="flex flex-wrap gap-2">
            {user.technologies?.length > 0
              ? user.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                  >
                    {tech}
                  </span>
                ))
              : "NA"}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            <Edit size={16} /> Edit
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-3">
              {/* Name */}
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Name"
              />
              {/* Role - not editable */}
              <p className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600">
                {userData.role || "NA"}
              </p>
              {/* Email */}
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
              />
              {/* Phone */}
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Phone"
              />
              {/* Qualification */}
              <input
                type="text"
                name="qualification"
                value={userData.qualification}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Qualification"
              />
              {/* Technologies */}
              <input
                type="text"
                name="technologies"
                value={userData.technologies}
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
    </>
  );
}

export default UserProfile;

