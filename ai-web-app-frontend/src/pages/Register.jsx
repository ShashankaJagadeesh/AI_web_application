import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(username, password);
            alert("Registration successful! You can now log in.");
            navigate("/");
        } catch (error) {
            console.error("Registration Error:", error); // Logs the error to the console
            alert(`Registration failed: ${error.response?.data?.msg || "Try again later."}`);
        }
        
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="p-6 bg-white shadow-md rounded">
                <h2 className="text-lg font-bold mb-4">Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-2 w-full mb-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
