import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
    
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }
    
        // Debugging log before sending request
        console.log("Registering User with Data:", { first_name, last_name, email, password });
    
        try {
            await registerUser(first_name, last_name, email, password);
            alert("Registration Successful!");
            navigate("/login");
        } catch (error) {
            console.error("Registration Error:", error);
            setErrorMessage(error.response?.data?.msg || "Registration failed.");
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
                        <h1 className="fw-bold text-white display-4">Join AI Revolution</h1>
                        <p className="lead text-warning">Sign up to explore AI-powered insights.</p>

                        <div className="d-flex justify-content-center mt-4">
                            <div className="text-center mx-3">
                                <img src="https://cdn-icons-png.freepik.com/512/10108/10108414.png" width="80" alt="AI Security" />
                                <h5 className="mt-2">Secure AI</h5>
                            </div>
                            <div className="text-center mx-3">
                                <img src="https://i0.wp.com/aitoolsarena.com/wp-content/uploads/2023/02/cropped-AI-Tools-Arena-512.png?fit=512%2C512&ssl=1" width="80" alt="Smart AI" />
                                <h5 className="mt-2">Smart AI</h5>
                            </div>
                            <div className="text-center mx-3">
                                <img src="https://cdn-icons-png.freepik.com/256/15017/15017446.png?semt=ais_hybrid" width="80" alt="Fast Insights" />
                                <h5 className="mt-2">Fast Insights</h5>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Registration Form */}
                    <div className="col-md-6">
                        <div className="card bg-white text-dark shadow-lg rounded-4 p-5">
                            <h2 className="text-center fw-bold mb-4">Create Your Account</h2>
                            {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                            <form onSubmit={handleRegister}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 p-3"
                                            placeholder="Enter your first name"
                                            value={first_name}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 p-3"
                                            placeholder="Enter your last name"
                                            value={last_name}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control rounded-3 p-3"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control rounded-3 p-3"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Confirm Password</label>
                                        <input
                                            type="password"
                                            className={`form-control rounded-3 p-3 ${
                                                password && confirmPassword && (password !== confirmPassword) ? "border-danger" : ""
                                            }`}
                                            placeholder="Confirm password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        {password && confirmPassword && password !== confirmPassword && (
                                            <small className="text-danger">Passwords do not match</small>
                                        )}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 shadow-sm">
                                    Register
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="text-center my-3">
                                <span className="text-muted">or</span>
                            </div>

                            {/* Already Have an Account? */}
                            <button
                                onClick={() => navigate("/login")}
                                className="btn btn-outline-primary w-100 py-3 rounded-3 shadow-sm">
                                Already Have an Account?
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
