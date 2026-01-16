import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import VerifyTitle from "./pages/VerifyTitle";
import Result from "./pages/Result";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicRoute from "./routes/PublicRoute";
import NotFound from "./components/NotFound";
import MainLayout from "./layout/MainLayout";
import ContactAdmin from "./pages/ContactAdmin";
import RestrictedRegistration from "./pages/RestrictedRegistration";
import AdminRequests from "./pages/AdminRequests";
import UserRequests from "./pages/UserRequests";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
       <Routes>
        <Route 
          path="/" 
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          } 
        />
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
        <Route 
          path="/restricted-registration"
          element={
            <PublicRoute>
              <RestrictedRegistration />
            </PublicRoute>
          }
        />

        {/* User routes */}
        <Route
          path="/contact"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MainLayout>
                <ContactAdmin />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <MainLayout>
                <VerifyTitle />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <MainLayout>
                <Result />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <MainLayout>
                <History />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-requests"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MainLayout>
                <UserRequests />
              </MainLayout>
            </ProtectedRoute>
          }
        />


        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}> 
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}> 
              <MainLayout>
                <AdminRequests />
              </MainLayout>
            </ProtectedRoute>
          }
        />

         <Route 
          path="*" 
          element={
            <NotFound />
          } 
        />
      </Routes>
    </>
  );
}

export default App;
