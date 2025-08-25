import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./auth/authSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Navbar";
import { Menu } from "lucide-react";
import { useState } from "react";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      try {
        await dispatch(logoutUser(accessToken));
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!user) return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block">
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar (slide-in) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar Drawer */}
          <div className="relative z-50 w-64">
            <Sidebar onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar (mobile only) */}
        <header className="md:hidden flex items-center justify-between bg-blue-700 text-white px-4 py-3 shadow">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">MyApp</span>
          <div></div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Welcome, {user.name}
          </h1>
        </main>
      </div>
    </div>
  );
}

export default Home;
