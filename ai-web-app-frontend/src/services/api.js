import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth"; // Backend URL

export const generateAIResponse = async (query, option) => {
    try {
        const payload = { query, option };
        console.log("Sending AI Request Payload:", payload); // Debugging log

        const response = await axios.post("http://localhost:5000/api/ai/generate", payload);

        console.log("AI Response Received:", response.data);
        return response.data;
    } catch (error) {
        console.error("AI API Error:", error.response?.data || error.message);
        throw new Error("Failed to generate AI response");
    }
};


export const registerUser = async (first_name, last_name, email, password) => {
    try {
        const payload = { first_name, last_name, email, password };

        console.log("📤 Sending Registration Request Payload:", payload); // Debugging log

        const response = await axios.post("http://localhost:5000/api/auth/register", payload, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("✅ Registration Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("🚨 Registration API Error:", error.response?.data || error.message);
        throw new Error("Registration failed");
    }
};



export const loginUser = async (email, password) => {
    console.log("Attempting Login - Email:", email);
    console.log("Attempting Login - Password:", password);

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        console.log("Response Status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Login Error Response:", errorData);
            throw new Error(errorData.msg || "Login failed");
        }

        const data = await response.json();
        console.log("Successful Login - Received Token:", data.token);
        return data;
    } catch (error) {
        console.error("Login API Error:", error);
        throw error;
    }
};


