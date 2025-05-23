// routes/queries.js
const express = require("express");
const router = express.Router();
const db = require("../config/database"); // Your MySQL or Sequelize connection
const authMiddleware = require("../middleware/authMiddleware");

// Save Query
router.post("/save-query", authMiddleware, async (req, res) => {
  try {
    const { query_text, option_type } = req.body;
    const user_id = req.user.id; // Provided by authMiddleware

    if (!query_text || !option_type) {
      return res.status(400).json({ error: "Missing query data" });
    }

    // Insert into the queries table
    await db.query(
      "INSERT INTO queries (user_id, query_text, option_type) VALUES (?, ?, ?)",
      { replacements: [user_id, query_text, option_type] }
    );

    res.status(201).json({ message: "Query saved successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch Query History
router.get("/query-history", authMiddleware, async (req, res) => {
    const user_id = req.user.id; // Provided by authMiddleware
  
    try {
      const [queries] = await db.query(
        "SELECT query_text, option_type, created_at FROM queries WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
        { replacements: [user_id] }
      );
      res.json(queries);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch query history" });
    }
  });

module.exports = router;
