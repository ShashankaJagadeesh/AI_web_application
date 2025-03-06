const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/generate", async (req, res) => {
    console.log("Received AI Request:", req.body); // For debugging frontend request of API

    const { query, option } = req.body;

    if (!query || !option) {
        console.error("Error: Missing 'query' or 'option' in request body.");
        return res.status(422).json({ msg: "Missing 'query' or 'option' in request body." });
    }

    if (!["calories", "translate", "summarize"].includes(option)) {
        console.error("Error: Invalid option selected.");
        return res.status(400).json({ msg: "Invalid option selected." });
    }

    let structuredPrompt = "";
    switch (option) {
        case "calories":
            structuredPrompt = `Provide detailed calorie information for: ${query}`;
            break;
        case "translate":
            structuredPrompt = `Translate this text to another language: ${query}`;
            break;
        case "summarize":
            structuredPrompt = `Summarize this text in a short paragraph: ${query}`;
            break;
        default:
            structuredPrompt = query;
    }

    // For mistralAI, had to use 'messages' format instead of 'prompt'
    const requestBody = {
        model: "mistral-small",
        messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            { role: "user", content: structuredPrompt }
        ],
        max_tokens: 300
    };

    console.log("Sending AI Request to Mistral:", requestBody);

    try {
        const response = await axios.post(
            "https://api.mistral.ai/v1/chat/completions",
            requestBody,
            {
                headers: {
                    "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Mistral AI Response:", response.data);
        res.json({ result: response.data.choices[0].message.content.trim() });
    } catch (err) {
        console.error(" AI Request Error:", err.response?.data || err.message);
        res.status(500).json({ msg: "Error processing AI request", error: err.message });
    }
});


module.exports = router;
