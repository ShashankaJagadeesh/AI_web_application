import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";  // ✅ Ensure Router is here
import App from "./App.jsx";
import "./index.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>  {/* ✅ Wrap App inside Router */}
      <App />
    </Router>
  </StrictMode>
);
