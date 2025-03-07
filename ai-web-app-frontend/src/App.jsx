import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import useAuthStore from "./store/authStore"; // Ensure auth state is used
import React from "react";
import './App.css'; // or your global css file


function App() {
  const { token } = useAuthStore(); // Check if user is logged in

  return (
    <Routes>
      {/* ✅ Redirect '/' to '/login' if not authenticated */}
      <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      
      {/* ✅ Define Proper Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
