import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Users from "./Users";
import Home from "./Home";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import Roles from "./Roles";
import Analytics from "./Analytics";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./Unauthorized";
import NonAdminRoute from "./NonAdminRoute";
import useAutoLogout from "./hooks/useAutoLogout"; 
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import RoleDetail from "./RoleDetail";

function AppRoutes() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const user = useSelector((state) => state.auth.user);

  useAutoLogout(); 
  return (
    <Routes>
      <Route
  path="/"
  element={
    <NonAdminRoute>
      <Home />
    </NonAdminRoute>
  }
/>

     <Route path="/login" element={<Login />} />
     <Route path="/user-profile" element={<UserProfile />} />
     <Route path="/change-password" element={<ChangePassword />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/admin" 
        element={
          <ProtectedRoute >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} /> 
        <Route path="roles" element={<Roles />} > 
        </Route>
        <Route path="role-detail/:id" element={<RoleDetail />} />
        <Route path="users" element={<Users />} />
        <Route path="register" element={<Register />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default AppRoutes;
