import { useEffect, useState } from "react";
import axios from "axios";
import { registerUser } from "./auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Register() {
  const dispatch = useDispatch();
    const [roles, setRoles] = useState([]);
  
  const { loading, error, message } = useSelector((state) => state.auth);
 useEffect(() => {
  const authData = JSON.parse(localStorage.getItem('auth') || "{}");
  const accessToken = authData?.accessToken;
  if (!accessToken) {
    console.error("No access token found");
    return;
  }

  async function getRoles() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/get-roles`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data.data;
      setRoles(data.roles);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  }

  getRoles();
}, []);


  const [formData, setFormData] = useState({    
    name: "",
    email: "",
    password: "1234",
    phone: "",
    role: "",
    qualification: "",
    technologies: [],
  });

  const [techInput, setTechInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleAddTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTechnology = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
    if (message) {
    alert(message);
    setFormData({
      name: "",
      email: "",
      password: "1234",
      phone: "",
      role: "",
      qualification: "",
      technologies: [],
    });
    setTechInput("");
  }
  if (error) {
    alert(error);
  }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Add Users</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md capitalize"
            >
               <option value="" disabled hidden>
                Select a role
                </option>
              {
                roles.map((role)=>(
                  <option className="capitalize" key={role.name} value={role.name}>{role.name}</option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block mb-1">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1">Qualification</label>
            <input
              type="file"
              name="profile"
              accept="image/*"
              onChange={(event) => {
                setSelectedFile(event.target.files[0]);
              }}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1">Technologies</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add technology"
                className="flex-grow px-4 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={handleAddTechnology}
                className="bg-blue-500 text-white px-3 rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap mt-2 gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(tech)}
                    className="ml-2 text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Register;
