import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "../api/axios.js";
import toast from "react-hot-toast";

const apiurl = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on app load
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiurl}/auth/check-auth`, {
        withCredentials: true,
      });

      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = useCallback(async (userData) => {
    try {
      const { data } = await axios.post(
        `${apiurl}/auth/login`,
        userData,
        { withCredentials: true }
      );

      if (!data?.user) {
        throw new Error("Invalid login response");
      }

      setUser(data.user);

      return data.user;

    } catch (error) {
      setUser(null);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    }
  }, []);

  // 🚪 Logout
  const logout = useCallback(async () => {
    try {
      await axios.post(`${apiurl}/auth/logout`, {}, { withCredentials: true });
      toast.success("Logout Successful");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "An error occurred during logout"
      );
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    name: user?.name || null,
    role: user?.role || "user",
    login,
    logout,
    loading,
    isAuthenticated: !!user, 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
