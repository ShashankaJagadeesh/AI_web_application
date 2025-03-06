import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { generateAIResponse } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [query, setQuery] = useState("");
    const [option, setOption] = useState("calories");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStore();
    const [aiTip, setAiTip] = useState("");

    if (!token) {
        navigate("/login");
    }

    // AI Tip of the Day (Random)
    const aiTips = [
        "💡 Did you know? AI can help predict disease outbreaks before they happen!",
        "🚀 AI translation models can process over 100 languages in real time.",
        "📄 AI can summarize an entire book into a few key takeaways in seconds!",
        "🥗 Curious about your meal? AI can estimate calories with image recognition!",
        "🔍 AI-powered search engines can detect fake news using credibility analysis."
    ];

    useEffect(() => {
        setAiTip(aiTips[Math.floor(Math.random() * aiTips.length)]);
    }, []);

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

    const scrollToAISection = () => {
        document.getElementById("ai-section").scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="bg-dark text-white">
            {/* Navbar with Logout Button */}
            <nav className="navbar navbar-dark bg-dark fixed-top px-4">
                <h3 className="navbar-brand">AI Dashboard</h3>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </nav>

            {/* Spacing Below Navbar */}
            <div className="mt-5 pt-5"></div>

            {/* AI Engagement Section - Interactive */}
            <div className="container-fluid text-center py-4">
                <h4 className="text-info">🤖 AI Insights of the Day</h4>
                <p className="lead text-warning">{aiTip}</p>
            </div>

            {/* Hero Section - Instructions */}
            <div className="container-fluid text-center py-5">
                <h1 className="fw-bold display-4">Welcome to AI Dashboard</h1>
                <p className="lead">
                    Use AI to <span className="text-warning">Generate Insights</span>, 
                    <span className="text-warning"> Translate Text</span>, and 
                    <span className="text-warning"> Summarize PDFs</span> effortlessly.
                </p>

                {/* Instructions Section */}
                <div className="container text-center my-5">
                    <h2 className="fw-bold text-primary">How It Works</h2>
                    <div className="row mt-4">
                        <div className="col-md-4">
                            <img src="https://cdn-icons-png.flaticon.com/512/891/891699.png" width="80" alt="Step 1" />
                            <h5 className="mt-2">Step 1: Choose a Function</h5>
                            <p className="small">Select whether you want to get **calorie information**, **translate text**, or **summarize a PDF**.</p>
                        </div>
                        <div className="col-md-4">
                            <img src="https://cdn-icons-png.flaticon.com/512/1005/1005141.png" width="80" alt="Step 2" />
                            <h5 className="mt-2">Step 2: Enter Your Query</h5>
                            <p className="small">Type in your text, upload your file, or provide the necessary details for AI processing.</p>
                        </div>
                        <div className="col-md-4">
                            <img src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png" width="80" alt="Step 3" />
                            <h5 className="mt-2">Step 3: Get AI Response</h5>
                            <p className="small">Click "Generate" and receive your AI-powered results instantly.</p>
                        </div>
                    </div>
                </div>

                {/* Get Started Button */}
                <button onClick={scrollToAISection} className="btn btn-primary mt-4 px-5 py-2">
                    Get Started
                </button>
            </div>

            {/* AI Generation Section */}
            <div id="ai-section" className="container py-5">
                <h2 className="text-center text-primary fw-bold">AI-Powered Query System</h2>
                <p className="text-center text-muted">Type a question and let AI do the work.</p>

                <div className="card shadow p-4 mt-4 bg-white text-dark">
                    {/* Input Section */}
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

                    {/* Response Section */}
                    <div className="mt-3">
                        <h5 className="fw-bold text-dark">AI Response</h5>
                        <p className="text-muted">{loading ? "Fetching response..." : response || "Your result will appear here."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
