import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

    try {
      await axios.post(`${apiurl}/auth/register`, form);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/70 border border-slate-200 rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-extrabold text-center mb-2">
          Create Account
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Register to use the AI Title Verification System
        </p>

        {error && (
          <div className="mb-4 text-sm text-rose-600 bg-rose-50 p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" name="name" onChange={handleChange} />
          <Input label="Email Address" name="email" type="email" onChange={handleChange} />
          <Input label="Password" name="password" type="password" onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = "text", onChange }) => (
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

export default Signup;
