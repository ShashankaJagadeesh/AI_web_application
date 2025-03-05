const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Route (Requires JWT authentication)
router.get("/protected-route", authenticateToken, (req, res) => {
    res.json({ msg: "Welcome to the protected route!", user: req.user });
});

module.exports = router;
    