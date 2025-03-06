const express = require("express");
const axios = require("axios");
require("dotenv").config(); 

const router = express.Router();

// AI route for generating response
router.post("/generate", async (req, res) => {
    const { query, option } = req.body;

    if (!["calories", "translate", "summarize"].includes(option)) {
        return res.status(400).json({ msg: "Invalid option" });
    }

    try {
        const response = await axios.post(
            "https://api.mistral.ai/v1/chat/completions", // Mistral API endpoint
            {
                model: "mistral-small", 
                messages: [{ role: "user", content: `${option}: ${query}` }],
                max_tokens: 100
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ result: response.data.choices[0].message.content });
    } catch (err) {
        console.error("Mistral AI Error:", err.response?.data || err.message);
        res.status(500).json({ msg: "Failed to generate AI response" });
    }
});

module.exports = router;
