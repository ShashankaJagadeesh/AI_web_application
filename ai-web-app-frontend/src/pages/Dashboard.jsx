import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { generateAIResponse } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatBot from "../services/chatbot.jsx";

function Dashboard() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [query, setQuery] = useState("");
    const [option, setOption] = useState("calories");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStore();
    const [queryHistory, setQueryHistory] = useState([]);
    const [showChat, setShowChat] = useState(false);


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
                {/* Why Choose Our AI Section */}
                <div className="container mt-5">
                <h2 className="text-center fw-bold text-primary mb-4">Why Choose Our AI?</h2>

                <div className="row g-4">
                    <div className="col-md-4">
                    <div
                        className="card h-100 border-0 shadow card-lift"
                        style={{
                        background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                        borderRadius: "1rem"
                        }}
                    >
                        <div className="card-body text-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1258/1258875.png"
                            alt="Speed Icon"
                            style={{ width: "60px" }}
                            className="mb-3"
                        />
                        <h5 className="card-title fw-bold">Lightning-Fast Responses</h5>
                        <p className="card-text small">
                            Our AI processes your queries in seconds, saving you valuable time and effort.
                        </p>
                        </div>
                    </div>
                    </div>

                    <div className="col-md-4">
                    <div
                        className="card h-100 border-0 shadow card-lift"
                        style={{
                        background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                        borderRadius: "1rem"
                        }}
                    >
                        <div className="card-body text-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4201/4201973.png"
                            alt="Accuracy Icon"
                            style={{ width: "60px" }}
                            className="mb-3"
                        />
                        <h5 className="card-title fw-bold">High Accuracy</h5>
                        <p className="card-text small">
                            Benefit from advanced AI models that provide precise translations, summaries, and insights.
                        </p>
                        </div>
                    </div>
                    </div>

                    <div className="col-md-4">
                    <div
                        className="card h-100 border-0 shadow card-lift"
                        style={{
                        background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                        borderRadius: "1rem"
                        }}
                    >
                        <div className="card-body text-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3388/3388645.png"
                            alt="Security Icon"
                            style={{ width: "60px" }}
                            className="mb-3"
                        />
                        <h5 className="card-title fw-bold">Secure & Private</h5>
                        <p className="card-text small">
                            We prioritize your data security and privacy, ensuring your queries remain confidential.
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>


                {/* Instructions */}
                <div className="container text-center my-5">
                    <h2 className="fw-bold text-primary mb-4">How It Works</h2>

                    <div
                        id="howItWorksCarousel"
                        className="carousel slide"
                        data-bs-ride="carousel"
                        style={{ maxWidth: "700px", margin: "0 auto" }}
                    >
                        <div className="carousel-inner" style={{ minHeight: "150px" }}>
                        {/* Slide 1 */}
                        <div className="carousel-item active">
                            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <img
                                src="https://cdn-icons-png.freepik.com/512/5485/5485853.png"
                                alt="Step 1"
                                style={{ width: "80px" }}
                                className="mb-3"
                            />
                            <h5 className="fw-bold">Step 1: Choose a Function</h5>
                            <p className="small">
                                Select whether you want Calorie information, Translate text, or Summarize a PDF.
                            </p>
                            </div>
                        </div>

                        {/* Slide 2 */}
                        <div className="carousel-item">
                            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1005/1005141.png"
                                alt="Step 2"
                                style={{ width: "80px" }}
                                className="mb-3"
                            />
                            <h5 className="fw-bold">Step 2: Enter Your Query</h5>
                            <p className="small">
                                Type in your text, upload a file, or provide details for AI processing.
                            </p>
                            </div>
                        </div>

                        {/* Slide 3 */}
                        <div className="carousel-item">
                            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <img
                                src="https://cdn-icons-png.freepik.com/512/16856/16856134.png"
                                alt="Step 3"
                                style={{ width: "80px" }}
                                className="mb-3"
                            />
                            <h5 className="fw-bold">Step 3: Get AI Response</h5>
                            <p className="small">
                                Click “Generate” and receive your AI-powered results instantly.
                            </p>
                            </div>
                        </div>
                        </div>

                    {/* Carousel Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#howItWorksCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                        </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#howItWorksCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                        </button>
                    </div>

                    {/* Get Started Button*/}
                    <div style={{ marginTop: "3rem" }}>
                        <button
                        className="btn btn-primary px-5 py-2"
                        onClick={() =>
                            document.getElementById("ai-section").scrollIntoView({ behavior: "smooth" })
                        }
                        >
                        Get Started
                        </button>
                    </div>
                 </div>           
            </div>

            {/* AI Section */}
            <div id="ai-section" className="container py-5">
                <h2 className="text-center text-primary fw-bold">AI-Powered Query System</h2>
                <p className="text-center text-muted">Type a question and let AI do the work.</p>

                <div className="card shadow-lg p-4 mt-4 bg-white text-dark border-0 rounded-4">
                    {/* AI Query Suggestions */}
                    <div className="mb-3 text-center">
                    <h6 className="text-muted">Try these examples:</h6>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setQuery("How many calories in a banana?")}
                        >
                        Calories in banana
                        </button>
                        <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setQuery("Translate 'Hello' to French")}
                        >
                        Translate 'Hello' to French
                        </button>
                        <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setQuery("Summarize the history of AI")}
                        >
                        Summarize AI history
                        </button>
                    </div>
                    </div>

                    {/* Input Section */}
                    <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control rounded-start p-3 border-primary shadow-sm"
                        placeholder="Enter your query..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select
                        className="form-select border-primary shadow-sm"
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                    >
                        <option value="calories">Calorie Info</option>
                        <option value="translate">Text Translation</option>
                        <option value="summarize">PDF Summarization</option>
                    </select>
                    <button
                        className="btn btn-primary px-4 shadow-sm fw-bold"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Generate"}
                    </button>
                    </div>

                    {/* Query History Section - Display Last 5 Queries */}
                    <div className="mt-3">
                    <h6 className="text-muted">Recent Queries:</h6>
                    {queryHistory.length > 0 ? (
                        <ul className="list-group list-group-flush border rounded-3 shadow-sm">
                        {queryHistory.map((item, index) =>
                            item && item.query && item.option ? (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                onClick={() => setQuery(item.query)}
                                style={{ cursor: "pointer" }}
                            >
                                {item.query}
                                <span className="badge bg-primary rounded-pill">{item.option}</span>
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

                    {response && (
                        <div className="d-flex gap-2">
                        {/* Copy to Clipboard Button */}
                        <button
                            className="btn btn-outline-secondary mt-3"
                            onClick={() => navigator.clipboard.writeText(response)}
                        >
                            Copy AI Response
                        </button>

                        {/* Download AI Response Button */}
                        <button className="btn btn-outline-success mt-3"
                            onClick={() => {
                        const blob = new Blob([response], { type: "text/plain" });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = "AI_Response.txt";
                        document.body.appendChild(link);
                        link.click();
                         document.body.removeChild(link);
                        }}
                        >
                            Download AI Response
                        </button>
                    </div>
                        
                    )}
                    </div>
                </div>
                {/* Floating Chat Toggle Button */}
                <button
                className="btn btn-secondary"
                style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    zIndex: 9999,
                }}
                onClick={() => setShowChat(!showChat)}
                >
                {showChat ? "Close Chat" : "Chat"}
                </button>

                {/* Chat Popup in Bottom-Right */}
                {showChat && (
                <div
                style={{
                    position: "fixed",
                    bottom: "5rem",
                    right: "2rem",
                    width: "300px",
                    height: "400px",
                    background: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    borderRadius: "0.5rem",
                    zIndex: 10000,
                    overflow: "hidden",         // Clip child overflow
                    display: "flex",           // Allows ChatBot to fill
                    flexDirection: "column"
                  }}
                >
                    <ChatBot />
                </div>
                )}
            </div>
        </div>
        
    );
    
}



export default Dashboard;
