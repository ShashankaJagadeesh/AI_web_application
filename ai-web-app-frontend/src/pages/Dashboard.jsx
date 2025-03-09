import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { generateAIResponse } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatBot from "../services/chatbot.jsx";

//Components
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import QueryHistory from "../components/QueryHistory";
import AIResponse from "../components/AiResponse";

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
  const [isReading, setIsReading] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const SESSION_TIMEOUT = 600000; // 10 minutes inactivity causes logging out of user

  const resetTimer = () => {
    setLastActivity(Date.now());
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  const handleLogout = useCallback(() => {
    const user = useAuthStore.getState().user;
    if (user && user.id) {
      const storageKey = `queryHistory_${user.id}`;
      localStorage.removeItem(storageKey);
    }
    logout();
    navigate("/login");
  }, [logout, navigate]); // Dependencies

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        alert("Session expired due to inactivity. You will be logged out.");
        handleLogout();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [lastActivity, handleLogout]);

  // Dark/Light Mode Toggle
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

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

  

  const handleToggleReading = () => {
    if (!response) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);

      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handleGenerate = async () => {
    if (!query.trim()) return alert("Please enter a query!");
  
    setLoading(true);
    setResponse("");
  
    try {
      // 1. Generate AI response
      const structuredQuery = formatQuery(query, option);
      const aiResponse = await generateAIResponse(structuredQuery, option);
      setResponse(aiResponse.result);
  
      // 2. Update local storage 
      const user = useAuthStore.getState().user;
      if (!user || !user.id) {
        console.error("User ID not found.");
        return;
      }
  
      const storageKey = `queryHistory_${user.id}`;
      let updatedHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
      updatedHistory = updatedHistory.filter(
        (item) => typeof item === "object" && item.query && item.option
      );
      const newQuery = { query: query.trim(), option };
      updatedHistory = [newQuery, ...updatedHistory].slice(0, 5);
      setQueryHistory(updatedHistory);
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
  
      console.log("Updated Query History:", updatedHistory);
  
      // 3. Save Query to DB
      const tokenFromStore = useAuthStore.getState().token; 
      if (!tokenFromStore) {
        console.error("No token found in auth store");
        return;
      }
  
      // Post the query to /save-query endpoint
      const saveResponse = await fetch("http://localhost:5000/api/save-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenFromStore}`
        },
        body: JSON.stringify({
          query_text: query.trim(),
          option_type: option
        })
      });
  
      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error("Error saving query to DB:", errorData);
      } else {
        console.log("Query saved to DB successfully!");
      }
  
    } catch (error) {
      console.error("AI Request Error:", error);
      alert("Failed to generate AI response.");
    } finally {
      setLoading(false);
    }
  };
  
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

  const fetchQueryHistoryFromDB = async () => {
    try {
      const tokenFromStore = localStorage.getItem("token") || useAuthStore.getState().token;
      const res = await fetch("http://localhost:5000/api/query-history", {
        headers: { "Authorization": `Bearer ${tokenFromStore}` },
      });
      if (res.ok) {
        let data = await res.json();
        data = data.map(item => ({
          query: item.query_text,
          option: item.option_type,
          created_at: item.created_at
        }));
        setQueryHistory(data);
        console.log("Transformed Query History from DB:", data);
      } else {
        console.error("Failed to fetch query history from DB");
      }
    } catch (error) {
      console.error("Error fetching query history from DB:", error);
    }
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
          Use AI to <span className="fw-bold">Generate Insights</span>,
          <span className="fw-bold"> Translate Text</span>, and
          <span className="fw-bold"> Summarize PDFs</span> effortlessly.
        </p>

        {/* Why Choose Our AI Section */}
        <div className="container mt-5">
          <h2 className="text-center fw-bold text-primary mb-4">Why Choose Our AI?</h2>
          <div className="row g-4">
            {/*<FeatureCards> */}
            <div className="col-md-4">
              <FeatureCard
                icon="https://cdn-icons-png.freepik.com/256/15017/15017446.png?semt=ais_hybrid"
                title="Lightning-Fast Responses"
                description="Our AI processes your queries in seconds, saving you valuable time and effort."
              />
            </div>
            <div className="col-md-4">
              <FeatureCard
                icon="https://i0.wp.com/aitoolsarena.com/wp-content/uploads/2023/02/cropped-AI-Tools-Arena-512.png?fit=512%2C512&ssl=1"
                title="High Accuracy"
                description="Benefit from advanced AI models that provide precise translations, summaries, and insights."
              />
            </div>
            <div className="col-md-4">
              <FeatureCard
                icon="https://cdn-icons-png.freepik.com/512/10108/10108414.png"
                title="Secure & Private"
                description="We prioritize your data security and privacy, ensuring your queries remain confidential."
              />
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

          {/* Get Started Button */}
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

          
            {/* Button to fetch saved queries from DB */}
        <div className="d-flex justify-content-start mb-3">
        <button
            className="btn btn-info"
            onClick={fetchQueryHistoryFromDB}
        >   
            Show Saved Queries
        </button>
        </div>

          {/* Query History: Using <QueryHistory> */}
          <QueryHistory queryHistory={queryHistory} setQuery={setQuery} />

          {/* Response Section: Using <AIResponse> */}
          <AIResponse
            response={response}
            loading={loading}
            handleToggleReading={handleToggleReading}
            isReading={isReading}
          />
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
          padding: "10px 15px",
          fontSize: "16px",
          borderRadius: "8px",
          background: "#007bff",
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
            width: "350px",
            height: "500px",
            background: "#007bff",
            boxShadow: "0 4px 15px rgba(8, 8, 8, 0.93)",
            borderRadius: "12px",
            zIndex: 10000,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "2px solid #ccc",
          }}
        >
          <ChatBot />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
