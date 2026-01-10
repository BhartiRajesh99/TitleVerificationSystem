import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const apiurl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    try {
      const { data } = await axios.post(`${apiurl}/auth/login`, form);

      const success = await login(data.user);
      if (success) {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-slate-100 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/70 border border-slate-200 rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-extrabold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Sign in to access the AI Title Verification System
        </p>

        {error && (
          <div className="mb-4 text-center text-sm text-rose-600 bg-rose-50 p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-600">
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
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      required
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

export default Login;
