import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

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
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
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

const Input = ({ label, name, type, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      required
      onChange={onChange}
      className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

export default Login;
