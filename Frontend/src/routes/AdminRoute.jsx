import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  // wait until auth loads
  if (authLoading) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;
  }

  // not logged in → go login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // not admin → go user dashboard
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // admin allowed
  return children;
};

export default AdminRoute;