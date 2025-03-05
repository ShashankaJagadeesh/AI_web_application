import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { loginUser } from "../services/api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(username, password);
            login(response.data.token);
            navigate("/dashboard"); // Redirect to dashboard
        } catch (error) {
            console.error("Login Error:", error); // Logs the error to the console
            alert(`Login failed: ${error.response?.data?.msg || "Check your credentials."}`);
        }
        
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded">
                <h2 className="text-lg font-bold mb-4">Login</h2>
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
