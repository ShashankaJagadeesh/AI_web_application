import React, { useState } from "react";  
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { loginUser } from "../services/api";

function Login() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);
            login(response.token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login Error:", error);
            alert(`Login failed: ${error.response?.data?.msg || "Check your credentials."}`);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row w-50 shadow-lg rounded-4 p-0 bg-white">
                <div className="col-md-6 d-flex flex-column justify-content-center p-5">
                    <h2 className="text-center fw-bold mb-4 text-dark">Login to Your Account</h2>
                    <form onSubmit={handleLogin} className="px-4">
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control rounded-3 p-3"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control rounded-3 p-3"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 shadow-sm">
                            Sign In
                        </button>
                    </form>
                </div>

                <div className="col-md-6 d-flex flex-column justify-content-center text-center text-white p-5 rounded-end"
                    style={{ background: "linear-gradient(to right, #007bff, #0056b3)" }}>
                    <h2 className="mb-3">New Here?</h2>
                    <p className="px-3">Join us today and unlock exclusive features!</p>
                    <button
                        onClick={() => navigate("/register")}
                        className="btn btn-light text-primary fw-bold px-4 py-3 rounded-3 mt-3 shadow-sm">
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
