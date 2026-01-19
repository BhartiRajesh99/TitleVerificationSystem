import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { RequestsProvider } from "./context/RequestsContext";
import ScrollToTop from "./components/ScrollToTop";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <RequestsProvider>
          <App />
        </RequestsProvider>
      </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);
