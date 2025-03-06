import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { generateAIResponse } from "../services/api";

function Dashboard() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [query, setQuery] = useState("");
    const [option, setOption] = useState("calories");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStore();

    if (!token) {
        navigate("/login");
    }

    const handleGenerate = async () => {
        if (!query) return alert("Please enter a query!");

        setLoading(true);
        setResponse("");

        try {
            const aiResponse = await generateAIResponse(query, option);
            setResponse(aiResponse.result);
        } catch (error) {
            console.error("AI Request Error:", error);
            alert("Failed to generate AI response.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
            <div className="row w-75 shadow-lg rounded-4 p-5 bg-white">
                {/* Header */}
                <div className="col-12 text-center mb-4">
                    <h2 className="fw-bold text-primary">AI Dashboard</h2>
                    <p className="text-muted">Generate AI-powered responses instantly</p>
                </div>

                {/* Input Section */}
                <div className="col-12">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control rounded-start p-3"
                            placeholder="Enter your query..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <select
                            className="form-select"
                            value={option}
                            onChange={(e) => setOption(e.target.value)}
                        >
                            <option value="calories">Calorie Info</option>
                            <option value="translate">Text Translation</option>
                            <option value="summarize">PDF Summarization</option>
                        </select>
                        <button
                            className="btn btn-primary px-4"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Generate"}
                        </button>
                    </div>
                </div>

                {/* Response Section */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm p-4 mt-3">
                        <h5 className="fw-bold text-dark">AI Response</h5>
                        <p className="text-muted">{loading ? "Fetching response..." : response || "Your result will appear here."}</p>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="col-12 text-center mt-4">
                    <button className="btn btn-danger px-4" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
