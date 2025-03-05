const express = require("express");
const axios = require("axios");

const router = express.Router();

// AI route for generating response
router.post("/generate", async (req, res) => {
    const { query, option } = req.body;

    if (!["calories", "translate", "summarize"].includes(option)) {
        return res.status(400).json({ msg: "Invalid option" });
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions", // Makes API request to OpenAI
            {
                model: "text-davinci-003", // AI model I am using
                prompt: `${option}: ${query}`, //Input query
                max_tokens: 100, // Limiting response length
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );

        res.json({ result: response.data.choices[0].text });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
