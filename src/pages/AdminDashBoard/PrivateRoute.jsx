// ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

const adminEmail = "naveed5651@gmail.com"; // your admin email

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/" />; // or show 403 page
  }

  return children;
};

export default PrivateRoute;
