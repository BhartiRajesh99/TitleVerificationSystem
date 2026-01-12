import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { name, role, loading, logout, isAuthenticated } = useAuth();
  
  if(loading) return null;
  
  const login = () => navigate("/login");

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <NavLink to="/" className="text-xl font-extrabold text-indigo-600">
          AI Title Verification
        </NavLink>

        <div className="flex gap-6 items-center text-sm font-medium">

          {isAuthenticated && (
            <>
              <NavLink to="/" className={navClass}>Home</NavLink>
              <NavLink to="/verify" className={navClass}>Verify</NavLink>
              <NavLink to="/history" className={navClass}>History</NavLink>

              {role === "admin" && (
                <NavLink to="/admin" className={navClass}>
                  Admin
                </NavLink>
              )}

              <span className=" px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                {name || "USER"}
              </span>

            </>
          )}

          <button
            onClick={isAuthenticated ? logout : login}
            className="px-4 py-1 text-xs cursor-pointer rounded-full bg-rose-100 text-rose-700"
          >
            {isAuthenticated ? "LOGOUT" : "LOGIN"}
          </button>

        </div>
      </div>
    </nav>
  );
};

const navClass = ({ isActive }) =>
  isActive
    ? "text-indigo-600 font-semibold"
    : "text-slate-600 hover:text-indigo-600";

export default Navbar;
