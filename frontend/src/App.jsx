import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import VerifyTitle from "./pages/VerifyTitle";
import Result from "./pages/Result";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicRoute from "./routes/PublicRoute";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Navbar />

       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* User routes */}
        <Route
          path="/verify"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <VerifyTitle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Result />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <History />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}> 
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

         <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
