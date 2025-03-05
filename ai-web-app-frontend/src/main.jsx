import React from "react";  // ✅ Ensure React is imported
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // ✅ Use BrowserRouter here
import "bootstrap/dist/css/bootstrap.min.css";  // ✅ Ensure Bootstrap is loaded
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>  {/* ✅ Wrap everything inside BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
