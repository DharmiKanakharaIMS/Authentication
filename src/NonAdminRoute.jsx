import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function NonAdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // ✅ If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ If admin, redirect to admin
  if (user?.role === "admin" || user?.role === "superadmin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default NonAdminRoute;
