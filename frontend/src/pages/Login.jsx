import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(form);
      
      toast.success("Login successful");
      if (user?.role === "admin") {
        navigate("/admin");   
      } else {
        navigate("/");                 
      }
    } catch (err) {
      setError("Invalid email or password");
      console.log(err);
      toast.error(
        err.message || "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-slate-100 px-4">
      <div className="w-full max-w-sm backdrop-blur-xl bg-white/70 border border-slate-200 rounded-3xl shadow-xl px-7 py-6">

        <h1 className="text-2xl font-extrabold text-center mb-1">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-slate-600 mb-5">
          AI Title Verification System
        </p>

        {error && (
          <div className="mb-3 text-center text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full cursor-pointer text-sm px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-slate-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-semibold">
            Create one
          </Link>
        </p>
      </div>
    </div>

  );
};

const Input = ({ label, name, type = "text", onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          name={name}
          type={isPassword && showPassword ? "text" : type}
          required
          onChange={onChange}
          className="
            w-full text-sm px-4 py-3 rounded-xl border border-slate-300
            focus:ring-2 focus:ring-indigo-500
            pr-11
          "
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute inset-y-0 right-3 flex items-center
              text-slate-400 hover:text-indigo-600
              transition
            "
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
