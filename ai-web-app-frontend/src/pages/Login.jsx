import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { loginUser } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

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
        <div className="bg-dark text-white vh-100 d-flex align-items-center justify-content-center">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark fixed-top px-4">
                <h3 className="navbar-brand">AI Web App</h3>
            </nav>

            {/* Main Section */}
            <div className="container">
                <div className="row align-items-center">
                    {/* Left Side - AI Branding */}
                    <div className="col-md-6 text-center">
                        <h1 className="fw-bold text-white display-4">Welcome to AI World</h1>
                        <p className="lead text-warning">Sign in to explore AI-powered insights.</p>

                        <div className="d-flex justify-content-center mt-4">
                            <div className="text-center mx-3">
                                <img src="https://cdn-icons-png.flaticon.com/512/2838/2838912.png" width="80" alt="AI Security" />
                                <h5 className="mt-2">Secure AI</h5>
                            </div>
                            <div className="text-center mx-3">
                                <img src="https://cdn-icons-png.flaticon.com/512/2602/2602105.png" width="80" alt="Smart AI" />
                                <h5 className="mt-2">Smart AI</h5>
                            </div>
                            <div className="text-center mx-3">
                                <img src="https://cdn-icons-png.flaticon.com/512/2736/2736838.png" width="80" alt="Fast Insights" />
                                <h5 className="mt-2">Fast Insights</h5>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Card */}
                    <div className="col-md-6">
                        <div className="card bg-white text-dark shadow-lg rounded-4 p-5">
                            <h2 className="text-center fw-bold mb-4">Login to Your Account</h2>
                            <form onSubmit={handleLogin}>
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

                            {/* Divider */}
                            <div className="text-center my-3">
                                <span className="text-muted">or</span>
                            </div>

                            {/* Sign Up */}
                            <button
                                onClick={() => navigate("/register")}
                                className="btn btn-outline-primary w-100 py-3 rounded-3 shadow-sm">
                                Create an Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
