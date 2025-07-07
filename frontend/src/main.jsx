import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import IntroductionPage from "./pages/IntroductionPage";
import AuthPage from "./pages/AuthPage";
import VerificationPage from "./pages/VerificationPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        path=""
        element={
          <PublicRoute>
            <IntroductionPage />
          </PublicRoute>
        }
      />
      <Route
        path="auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="verify"
        element={
          <PrivateRoute>
            <VerificationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="*"
        element={
          <PublicRoute>
            <IntroductionPage />
          </PublicRoute>
        }
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
