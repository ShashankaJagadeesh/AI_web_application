import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React from "react";

function Dashboard() {
    const { token, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-md rounded">
                <h2 className="text-lg font-bold mb-4">Welcome to the Dashboard</h2>
                <button 
                    onClick={logout} 
                    className="bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
