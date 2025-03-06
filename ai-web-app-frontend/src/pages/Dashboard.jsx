import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { generateAIResponse } from "../services/api";
import React from "react";

function Dashboard() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const token = useAuthStore((state) => state.token);

    const [query, setQuery] = useState("");
    const [option, setOption] = useState("calories");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    if (!token) {
        navigate("/login");
        return null;
    }

    const handleGenerate = async () => {
        setLoading(true);
        setResult(""); // Clear previous results
        try {
            const response = await generateAIResponse(query, option);
            setResult(response.result.trim()); // Display AI-generated response
        } catch (error) {
            console.error("AI Request Error:", error);
            setResult("Error generating response.");
        }
        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-center">Welcome to Your Dashboard 🎉</h2>
            <p className="text-muted text-center">Use the AI-powered features below:</p>

            {/* AI Feature Section */}
            <div className="card shadow-lg p-4 mt-4">
                <h3 className="fw-bold">AI-Powered Generator</h3>
                <select className="form-select my-3" value={option} onChange={(e) => setOption(e.target.value)}>
                    <option value="calories">Calorie Information</option>
                    <option value="translate">Text Translation</option>
                    <option value="summarize">PDF Summarization</option>
                </select>
                <textarea
                    className="form-control my-3"
                    rows="3"
                    placeholder="Enter your query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-primary w-100 py-2" onClick={handleGenerate} disabled={loading}>
                    {loading ? "Generating..." : "Generate AI Response"}
                </button>

                {result && (
                    <div className="alert alert-info mt-4">
                        <strong>AI Response:</strong> {result}
                    </div>
                )}
            </div>

            {/* Logout Button */}
            <div className="text-center mt-4">
                <button className="btn btn-danger px-4 py-2" onClick={() => { logout(); navigate("/login"); }}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
