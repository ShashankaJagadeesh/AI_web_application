import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import React from "react";

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
    
        try {
            await registerUser(first_name, last_name, email, password); 
            alert("Registration Successful!");
            navigate("/");
        } catch (error) {
            console.error("Registration Error:", error);
            setErrorMessage(error.response?.data?.msg || "Registration failed.");
        }
    };
    

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row w-50 shadow-lg rounded-4 p-0 bg-white">
                {/* Left Side - Information Section */}
                <div className="col-md-6 d-flex flex-column justify-content-center text-white p-5 rounded-start"
                    style={{ background: "linear-gradient(to right, #0056b3, #007bff)" }}>
                    <h2 className="mb-3">Welcome!</h2>
                    <p>Sign up and join our community. Get access to exclusive features and content.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="btn btn-light text-primary fw-bold px-4 py-3 rounded-3 mt-3 shadow-sm">
                        Already Have an Account?
                    </button>
                </div>

                {/* Right Side - Registration Form */}
                <div className="col-md-6 d-flex flex-column justify-content-center p-5">
                    <h2 className="text-center fw-bold mb-4 text-dark">Create Your Account</h2>
                    {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                    <form onSubmit={handleRegister}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">First Name</label>
                                <input type="text" className="form-control rounded-3 p-3"
                                    placeholder="Enter your first name"
                                    value={first_name} onChange={(e) => setFirstName(e.target.value)}
                                    required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control rounded-3 p-3"
                                    placeholder="Enter your last name"
                                    value={last_name} onChange={(e) => setLastName(e.target.value)}
                                    required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control rounded-3 p-3"
                                placeholder="Enter your email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                required />
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control rounded-3 p-3"
                                    placeholder="Enter password"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" className={`form-control rounded-3 p-3 ${password && confirmPassword && (password !== confirmPassword) ? "border-danger" : ""}`}
                                    placeholder="Confirm password"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    required />
                                {password && confirmPassword && password !== confirmPassword && (
                                    <small className="text-danger">Passwords do not match</small>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 shadow-sm">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
