import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../api/axios.js";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
axios.defaults.withCredentials = true

const apiUrl = import.meta.env.VITE_API_URL;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", avatar: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
          setError("Please select a valid image file (JPEG, PNG, or GIF)");
          return;
        }
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError("File size must be less than 5MB");
          return;
        }
        setForm({ ...form, avatar: file });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Password validation
    if (!isLogin && form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const url = isLogin ? `${apiUrl}/auth/login` : `${apiUrl}/auth/register`;

      if (isLogin) {
        const { data } = await axios.post(url, {
          email: form.email,
          password: form.password,
        },{withCredentials: true});
        if (data.user) {
          const loginSuccess = await login(data.user);
          if (loginSuccess) {
            toast.success("Login successful!");
            setTimeout(() => {
              navigate("/verify", { replace: true });
            }, 2000);
          } else {
            setError("Failed to set login state");
          }
        } else {
          setError("Invalid response from server");
        }
      } else {
        // Registration with avatar
        const formData = new FormData();
        formData.append("email", form.email);
        formData.append("password", form.password);
        if (form.avatar) {
          formData.append("avatar", form.avatar);
        }
        await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },{withCredentials: true});
        toast.success("Registration successful! Please login.");
        setIsLogin(true);
        setForm({ email: "", password: "", avatar: "" });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during authentication"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleForm = () => {
    if (!isLoading) {
      setError("");
      setForm({ email: "", password: "", avatar: "" });
      setIsLogin(!isLogin);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d2b1d] via-[#345635] to-[#6b8f71] bg-[length:200%_200%] animate-gradientShift p-8 relative">
      <div className="max-w-md w-full bg-[#e9ece5]/95 p-10 rounded-2xl shadow-2xl border border-[#aec3b0] backdrop-blur-md animate-fadeIn">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <h2 className="text-[#0d2b1d] text-center mb-6 text-2xl font-bold relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[50px] after:h-[3px] after:bg-[#345635] after:rounded">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <div className="relative transition-transform duration-300">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-4 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] transition-all duration-300 focus:border-[#0d2b1d] focus:shadow-lg focus:outline-none placeholder:text-[#345635]"
            />
          </div>
          <div className="relative transition-transform duration-300 ">
            <input
              name="password"
              type="password"
              placeholder={
                isLogin ? "Password" : "Password (min. 8 characters)"
              }
              value={form.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              minLength={!isLogin ? "8" : undefined}
              className="w-full p-4 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] transition-all duration-300 focus:border-[#0d2b1d] focus:shadow-lg focus:outline-none placeholder:text-[#345635]"
            />
          </div>
          {!isLogin && (
            <div className="relative mb-2">
              <label
                htmlFor="avatar"
                className="flex items-center gap-2 px-4 py-3 bg-[#e3efd3] border-2 border-dashed border-[#0d2b1d] rounded-lg cursor-pointer transition-all duration-300 text-[#0d2b1d] font-medium hover:bg-[#aec3b0] hover:shadow-md active:scale-95 active:bg-[#aec3b0]/90"
              >
                <span className="text-lg">📁</span>
                Choose Avatar Image (Optional)
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  disabled={isLoading}
                  className="absolute w-0.5 h-0.5 opacity-0 overflow-hidden -z-10"
                />
              </label>
              {form.avatar && (
                <span className="text-[#666] text-sm mt-2 block">
                  Selected: {form.avatar.name}
                </span>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#0d2b1d] text-[#e3efd3] border-none px-6 py-4 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wide relative overflow-hidden hover:bg-[#345635] hover:shadow-xl active:scale-95 active:bg-[#0d2b1d]/90 focus:outline-none focus:ring-2 focus:ring-[#345635]"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block mx-auto"></span>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
          <p
            className="text-center text-[#0d2b1d] cursor-pointer mt-2 text-sm transition-all duration-300 relative py-2 hover:text-[#345635] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-[#345635] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-2/3"
            onClick={handleToggleForm}
          >
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Sign In"}
          </p>
          {error && (
            <div className="text-red-500 text-center text-sm p-4 bg-[#e3efd3] rounded-md relative overflow-hidden border-1 border-red-500">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
