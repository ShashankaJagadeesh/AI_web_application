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
    const [queryHistory, setQueryHistory] = useState([]);

    // Dark/Light Mode Toggle
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    console.log("Auth Store State:", useAuthStore.getState());


    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    if (!token) {
        navigate("/login");
    }

    useEffect(() => {
        const { user } = useAuthStore.getState(); // Retrieve user
        if (!user || !user.id) {
            console.error("User ID not found. Make sure user is set in authStore.");
            return;
        }
    
        console.log("Logged-in User:", user);
    
        const storageKey = `queryHistory_${user.id}`;
        let storedHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
    
        // Checking if valid queries are loaded
        storedHistory = storedHistory.filter(item => typeof item === "object" && item.query && item.option);
    
        console.log("Loaded Query History for", user.id, ":", storedHistory);
        setQueryHistory(storedHistory);
    }, []);
    
    

    const handleGenerate = async () => {
        if (!query.trim()) return alert("Please enter a query!");
        
        setLoading(true);
        setResponse("");
    
        try {
            const structuredQuery = formatQuery(query, option);
            const aiResponse = await generateAIResponse(structuredQuery, option);
            setResponse(aiResponse.result);
    
            // Get logged-in user 
            const user = useAuthStore.getState().user; 
            if (!user || !user.id) {
                console.error("User ID not found.");
                return;
            }
    
            const storageKey = `queryHistory_${user.id}`; // Unique key for each user
    
            // Retrieve existing history
            let updatedHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
    
            // Ensure only objects with query & option are stored
            updatedHistory = updatedHistory.filter(item => typeof item === "object" && item.query && item.option);
    
            // Add the new query, keeping only the last 5
            const newQuery = { query: query.trim(), option };
            updatedHistory = [newQuery, ...updatedHistory].slice(0, 5);
    
            setQueryHistory(updatedHistory);
            localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    
            console.log("Updated Query History:", updatedHistory); // Debugging log
    
        } catch (error) {
            console.error("AI Request Error:", error);
            alert("Failed to generate AI response.");
        } finally {
            setLoading(false);
        }
    };
    
    // Function to format the query based on selected option
    const formatQuery = (query, option) => {
        switch (option) {
            case "calories":
                return `Provide calorie information for: ${query}`;
            case "translate":
                return `Translate the following text: ${query}`;
            case "summarize":
                return `Summarize this content: ${query}`;
            default:
                return query; // Default behavior if option is unknown
        }
    };
    
    const handleLogout = () => {
        const user = useAuthStore.getState().user;
        if (user && user.id) {
            const storageKey = `queryHistory_${user.id}`;
            localStorage.removeItem(storageKey);  // Clear only this user's queries
        }
    
        logout();
        navigate("/login");
    };
    

    return (
        <div className={theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"}>
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark fixed-top px-4">
                <h3 className="navbar-brand">AI Dashboard</h3>
                <div>
                    <button className="btn btn-outline-light me-3" onClick={toggleTheme}>
                        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="mt-5 pt-5"></div>

            {/* Hero Section */}
            <div className="container-fluid text-center py-5">
                <h1 className="fw-bold display-4">Welcome to AI Dashboard</h1>
                <p className="lead">
                    Use AI to <span className="text-warning">Generate Insights</span>, 
                    <span className="text-warning"> Translate Text</span>, and 
                    <span className="text-warning"> Summarize PDFs</span> effortlessly.
                </p>

                {/* Instructions */}
                <div className="container text-center my-5">
                    <h2 className="fw-bold text-primary">How It Works</h2>
                    <div className="row mt-4">
                        <div className="col-md-4">
                            <img src="https://cdn-icons-png.freepik.com/512/5485/5485853.png" width="80" alt="Step 1" />
                            <h5 className="mt-2">Step 1: Choose a Function</h5>
                            <p className="small">Select whether you want to get **calorie information**, **translate text**, or **summarize a PDF**.</p>
                        </div>
                        <div className="col-md-4">
                            <img src="https://cdn-icons-png.flaticon.com/512/1005/1005141.png" width="80" alt="Step 2" />
                            <h5 className="mt-2">Step 2: Enter Your Query</h5>
                            <p className="small">Type in your text, upload your file, or provide the necessary details for AI processing.</p>
                        </div>
                        <div className="col-md-4">
                            <img src="https://cdn-icons-png.freepik.com/512/16856/16856134.png" width="80" alt="Step 3" />
                            <h5 className="mt-2">Step 3: Get AI Response</h5>
                            <p className="small">Click "Generate" and receive your AI-powered results instantly.</p>
                        </div>
                    </div>
                </div>

                {/* Get Started Button */}
                <button className="btn btn-primary mt-4 px-5 py-2" onClick={() => document.getElementById("ai-section").scrollIntoView({ behavior: "smooth" })}>
                    Get Started
                </button>
            </div>

            {/* AI Section */}
            <div id="ai-section" className="container py-5">
                <h2 className="text-center text-primary fw-bold">AI-Powered Query System</h2>
                <p className="text-center text-muted">Type a question and let AI do the work.</p>

                <div className="card shadow p-4 mt-4 bg-white text-dark">
                    {/* AI Query Suggestions */}
                    <div className="mb-3">
                        <h6 className="text-muted">Try these examples:</h6>
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setQuery("How many calories in a banana?")}>Calories in banana</button>
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setQuery("Translate 'Hello' to French")}>Translate 'Hello' to French</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setQuery("Summarize the history of AI")}>Summarize AI history</button>
                    </div>

                    {/* Input Section */}
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control rounded-start p-3"
                            placeholder="Enter your query..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <select className="form-select" value={option} onChange={(e) => setOption(e.target.value)}>
                            <option value="calories">Calorie Info</option>
                            <option value="translate">Text Translation</option>
                            <option value="summarize">PDF Summarization</option>
                        </select>
                        <button className="btn btn-primary px-4" onClick={handleGenerate} disabled={loading}>
                            {loading ? "Loading..." : "Generate"}
                        </button>
                    </div>
                    {/* Query History Section - Display Last 5 Queries */}
                    <div className="mt-3">
                        <h6 className="text-muted">Recent Queries:</h6>
                        {queryHistory.length > 0 ? (
                            <ul className="list-group">
                                {queryHistory.map((item, index) => 
                                    item && item.query && item.option ? (
                                        <li key={index} className="list-group-item list-group-item-action"
                                            onClick={() => setQuery(item.query)}
                                            style={{ cursor: "pointer" }}>
                                            {item.query} ({item.option})
                                        </li>
                                    ) : null
                                )}
                            </ul>
                        ) : (
                            <p className="text-muted">No recent queries.</p>
                        )}
                    </div>


                    {/* Response Section */}
                    <div className="mt-3">
                        <h5 className="fw-bold text-dark">AI Response</h5>
                        <p className="text-muted">{loading ? "Fetching response..." : response || "Your result will appear here."}</p>

                        {/* Download AI Response Button */}
                        {response && (
                            <button className="btn btn-outline-success mt-3" onClick={() => {
                                const blob = new Blob([response], { type: "text/plain" });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = "AI_Response.txt";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}>
                                Download AI Response
                            </button>
                        )}
                    </div>                 
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
