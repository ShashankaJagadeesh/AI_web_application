const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/generate", async (req, res) => {
    console.log("Received AI Request:", req.body);

    const { query, option } = req.body;

    // Check for missing fields
    if (!option) {
        console.error("Error: Missing 'option' in request body.");
        return res.status(422).json({ msg: "Missing 'option' in request body." });
    }
    if (!["calories", "translate", "summarize", "chat"].includes(option)) {
        console.error("Error: Invalid option selected.");
        return res.status(400).json({ msg: "Invalid option selected." });
    }
    if (!query && option !== "chat") {
        // For 'chat', we allow an empty or multi-turn string as the query
        console.error("Error: Missing 'query' in request body for single-prompt mode.");
        return res.status(422).json({ msg: "Missing 'query' for single-prompt request." });
    }

    // Build a single user prompt
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
        case "chat":
            // For 'chat', just take the entire `query` as-is (which can contain multi-turn text).
            structuredPrompt = query;
            break;
        default:
            structuredPrompt = query;
    }

    // Mistral requires a 'messages' format
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
