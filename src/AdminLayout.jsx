import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Menu, LayoutDashboard, UserCog,
  BarChart3, Settings, X, CircleUserRound, KeyRound, ChevronDown,
  Users
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser } from './auth/authSlice'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false) // new state for dropdown
  const dropdownRef = useRef(null)
  const dispatch = useDispatch()
  const { accessToken, user } = JSON.parse(localStorage.getItem('auth'))
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: "dashboard" },
    { name: "Roles", icon: <UserCog />, path: "roles" },
    { name: "Analytics", icon: <BarChart3 />, path: "analytics" },
    { name: "Users", icon: <Users />, path: "users" },
    // Settings will be dropdown
  ]

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 md:relative bg-white w-64 h-screen p-4 shadow-md transition-transform duration-300 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className='flex justify-between mb-6 items-center'>
          <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
          {sidebarOpen && (
            <span className='text-red-500 cursor-pointer' onClick={() => setSidebarOpen(false)}>
              <X strokeWidth={'4'} />
            </span>
          )}
        </div>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 text-lg py-2 rounded hover:bg-blue-100 ${isActive ? 'bg-blue-100 font-semibold' : ''}`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}

          {/* Settings dropdown */}
          <div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-blue-100"
            >
              <div className="flex text-lg items-center">
                <span className="mr-3"><Settings /></span>
                Settings
              </div>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform ${settingsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {settingsOpen && (
              <div className="ml-8 mt-2 space-y-1">
                <NavLink
                  to="/user-profile"
                  className="flex items-center px-4 py-2 text-md rounded hover:bg-blue-50"
                >
                  <CircleUserRound className="w-5 h-5 mr-2" /> User Profile
                </NavLink>
                <NavLink
                  to="/change-password"
                  className="flex items-center px-4 py-2 text-md rounded hover:bg-blue-50"
                >
                  <KeyRound className="w-5 h-5 mr-2" /> Change Password
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-md text-left rounded hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-5 h-5 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
       {/* Header */}
<header className="flex items-center justify-between bg-gray-200 shadow-md px-4 py-3 flex-wrap md:flex-nowrap">
  {/* Left section: Menu button + Title */}
  <div className="flex items-center gap-3 flex-1 min-w-0">
    {/* Mobile menu toggle */}
    <button className="md:hidden flex-shrink-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
      <Menu className="w-6 h-6" />
    </button>

    {/* Title */}
    <h1 className="text-xl font-semibold text-gray-800 truncate">
      Admin Dashboard
    </h1>
  </div>

  {/* Right section: User info + profile + logout */}
  <div className="flex items-center gap-2 mt-2 md:mt-0 flex-shrink-0">
    {/* Greeting (hidden on very small screens) */}
    <span className="hidden sm:inline font-semibold text-gray-800">
      Welcome, <span className="text-blue-600">{user.name.toUpperCase()}</span>
    </span>

    {/* Profile image */}
    <Link to={'/user-profile'}>
      <img
        src="https://i.pravatar.cc/40"
        alt="profile"
        className="rounded-full w-8 h-8 border-2 border-blue-600"
      />
    </Link>

    {/* Logout button (shrink on mobile) */}
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-3 py-1 rounded font-medium text-sm sm:text-base hover:bg-red-700 whitespace-nowrap"
    >
      Logout
    </button>
  </div>
</header>


        {/* Outlet renders nested pages */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
