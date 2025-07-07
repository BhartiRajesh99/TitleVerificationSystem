import React from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Outlet />
    </>
  );
}

export default App;
