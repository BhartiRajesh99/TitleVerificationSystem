import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { RequestsProvider } from "./context/RequestsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RequestsProvider>
          <App />
        </RequestsProvider>
      </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);
