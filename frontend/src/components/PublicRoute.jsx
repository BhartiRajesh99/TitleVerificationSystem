import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span
          className="w-12 h-12 border-4 border-[#6b8f71] border-t-transparent rounded-full animate-spin"
          aria-label="Loading"
        />
      </div>
    );
  return !isAuthenticated ? children : <Navigate to="/verify" replace />;
}
