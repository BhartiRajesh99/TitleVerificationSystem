import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRequests } from "../context/RequestsContext";
import { apiUrl } from "../constants/apiURL";

const Navbar = () => {
  const navigate = useNavigate();
  const { name, role, loading, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const { pendingCount, setPendingCount } = useRequests();

  useEffect(() => {
    if (role !== "admin") return;

    const fetchRequestCount = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/requests/pending/count`, {
          withCredentials: true,
        });

        const data = res.data;
        setPendingCount(data.count);
      } catch (err) {
        console.error("Failed to fetch request count", err);
        toast.error("Failed to fetch request count");
      }
    };

    fetchRequestCount();
  }, [role, setPendingCount]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated]);

  if (loading) return <NavbarSkeleton />;

  return (
    <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-2xl border-b border-slate-200 shadow-[0_10px_80px_rgba(79,70,229,0.12)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <NavLink
          to="/"
          className="text-xl font-extrabold tracking-tight text-indigo-600"
        >
          <svg
            width="240"
            height="48"
            viewBox="0 0 240 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Icon  */}
            <circle cx="24" cy="24" r="20" fill="#EEF2FF" />
            <circle cx="24" cy="16" r="3" fill="#4F46E5" />
            <circle cx="16" cy="24" r="3" fill="#4F46E5" />
            <circle cx="32" cy="24" r="3" fill="#4F46E5" />
            <circle cx="24" cy="32" r="3" fill="#4F46E5" />

            {/* Connections  */}
            <line x1="24" y1="16" x2="16" y2="24" stroke="#6366F1" />
            <line x1="16" y1="24" x2="24" y2="32" stroke="#6366F1" />
            <line x1="24" y1="32" x2="32" y2="24" stroke="#6366F1" />
            <line x1="32" y1="24" x2="24" y2="16" stroke="#6366F1" />

            {/* Text */}
            <text
              x="56"
              y="30"
              fontSize="18"
              fontWeight="700"
              fill="#1E1B4B"
              fontFamily="Inter, system-ui, sans-serif"
            >
              AI Title Verify
            </text>
          </svg>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {isAuthenticated && (
            <>
              <NavItem to="/">Home</NavItem>
              <NavItem to="/verify">Verify</NavItem>
              <NavItem to="/history">History</NavItem>
              <NavItem
                to={role === "admin" ? "/admin-requests" : "/my-requests"}
              >
                Requests
                {role === "admin" && pendingCount > 0 && (
                  <span
                    className="
                        absolute -top-2 -right-3
                        flex items-center justify-center
                        min-w-[18px] h-[18px]
                        rounded-full bg-rose-500
                        text-[10px] font-bold text-white
                        px-1 text-2xs
                      "
                  >
                    {pendingCount}
                  </span>
                )}
              </NavItem>
              <NavItem to={role === "admin" ? "/admin" : "/contact"}>
                {role === "admin" ? "Admin Dashboard" : "Contact Admin"}
              </NavItem>

              {/* User */}
              <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                {name || "USER"}
              </span>
            </>
          )}

          {/* Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="
              flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold
              bg-rose-600 text-white
              hover:bg-rose-700 transition cursor-pointer
            "
            >
              <LogOut size={14} />
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="
                flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold
                bg-indigo-600 text-white
                hover:bg-indigo-700 transition cursor-pointer
              "
              >
                <LogIn size={14} />
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="
                px-4 py-1.5 rounded-full text-xs font-semibold
                border border-indigo-600 text-indigo-600
                hover:bg-indigo-50 transition cursor-pointer
              "
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-2 bg-white/90 backdrop-blur-xl border-t border-slate-200">
          <div className="flex flex-col gap-1 text-sm font-medium">
            {isAuthenticated && (
              <>
                <NavItem to="/" onClick={() => setOpen(false)}>
                  Home
                </NavItem>
                <NavItem to="/verify" onClick={() => setOpen(false)}>
                  Verify
                </NavItem>
                <NavItem to="/history" onClick={() => setOpen(false)}>
                  History
                </NavItem>
                <NavItem
                  to={role === "admin" ? "/admin-requests" : "/my-requests"}
                >
                  Requests
                  {role === "admin" && pendingCount > 0 && (
                    <span
                      className="
                        absolute -top-2 -right-3
                        flex items-center justify-center
                        min-w-[18px] h-[18px]
                        rounded-full bg-rose-500
                        text-[10px] font-bold text-white
                        px-1 text-2xs
                      "
                    >
                      {pendingCount}
                    </span>
                  )}
                </NavItem>
                <NavItem to={role === "admin" ? "/admin" : "/contact"}>
                  {role === "admin" ? "Admin Dashboard" : "Contact Admin"}
                </NavItem>

                <span className="px-3 py-1 w-fit text-xs rounded-full bg-indigo-100 text-indigo-700">
                  {name || "USER"}
                </span>
              </>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="mt-2 max-w-22 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-600  text-white text-sm font-semibold"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="px-4 py-2 w-full rounded-xl bg-indigo-600 text-white text-sm font-semibold"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/signup");
                  }}
                  className="px-4 py-2 w-full rounded-xl border border-indigo-600 text-indigo-600 text-sm font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative transition p-2 rounded-lg ${
        isActive
          ? "text-indigo-600 font-semibold bg-indigo-50"
          : "text-slate-600 hover:text-indigo-600"
      }`
    }
  >
    {children}   
  </NavLink>
);

const NavbarSkeleton = () => (
  <nav className="sticky top-0 z-50 h-[80.8px] bg-transparent backdrop-blur-2xl border-b border-slate-200 shadow-[0_10px_80px_rgba(79,70,229,0.12)]">
    <div className="max-w-7xl mx-auto px-6 py-7 flex justify-between items-center animate-pulse">
      <div className="h-6 w-48 bg-slate-200 rounded"></div>
      <div className="hidden md:flex gap-6">
        <div className="h-4 w-16 bg-slate-200 rounded"></div>
        <div className="h-4 w-16 bg-slate-200 rounded"></div>
        <div className="h-4 w-16 bg-slate-200 rounded"></div>
      </div>
    </div>
  </nav>
);

export default Navbar;
