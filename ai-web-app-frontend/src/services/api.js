

const API_BASE_URL = "http://localhost:5000/api/auth"; // Backend URL

export const generateAIResponse = async (query, option) => {
    try {
        const response = await fetch("http://localhost:5000/api/ai/generate", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, option })
        });

        if (!response.ok) {
            throw new Error("Failed to generate AI response");
        }

        return await response.json();
    } catch (error) {
        console.error("AI API Error:", error);
        throw error;
    }
};



export const registerUser = async (first_name, last_name, email, password) => {
    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ first_name, last_name, email, password }) 
        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Registration API Error:", error);
        throw error;
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


