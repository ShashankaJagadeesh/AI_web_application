// ChatBot.js
import React, { useState } from "react";
import { generateAIResponse } from "../services/api"; // or your path

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const userMsg = { role: "user", content: input.trim() };
      const updated = [...messages, userMsg];

      // Build conversation text
      const conversation = updated
        .map((m) => (m.role === "user" ? `User: ${m.content}` : `AI: ${m.content}`))
        .join("\n");

      const aiResponse = await generateAIResponse(conversation, "chat");

      const botMsg = { role: "bot", content: aiResponse.result };
      setMessages([...updated, botMsg]);
      setInput("");
    } catch (error) {
      console.error("ChatBot Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0.5rem" }}>
      {/* Chat Window */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "0.5rem", backgroundColor: "#f9f9f9", borderRadius: "0.5rem" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              margin: "0.5rem"
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "0.5rem 1rem",
                borderRadius: "1rem",
                background: msg.role === "user" ? "#007bff" : "#e9ecef",
                color: msg.role === "user" ? "#fff" : "#000"
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input + Send Button */}
      <div style={{ display: "flex" }}>
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={loading}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary ms-2" onClick={handleSendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
