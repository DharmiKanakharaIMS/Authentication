import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "./auth/permissionSlice";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

function Navbar({ onLogout }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: permissions, loading } = useSelector((state) => state.permissions);

  useEffect(() => {
    if (user) {
      dispatch(fetchPermissions({ roleId: user.roleId, token: user.accessToken }));
    }
  }, [user, dispatch]);

  if (!user) return null;

  return (
    <aside className="w-64 h-screen bg-blue-700 text-white flex flex-col">
      {/* Brand */}
      <div className="p-4 text-2xl font-bold border-b border-blue-500">MyApp</div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {loading && <p className="text-sm italic">Loading...</p>}
        {!loading &&
          permissions?.map((perm) => (
            <div
              key={perm._id}
              className="p-2 rounded hover:bg-blue-600 transition"
            >
              {perm.pageId?.name || "Untitled Page"}
            </div>
          ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-500">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-900 transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Navbar;
