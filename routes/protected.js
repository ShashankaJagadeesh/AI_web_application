const express = require("express");


const router = express.Router();

// Protected Route (Requires JWT)
router.get("/protected-route", authenticateToken, (req, res) => {
    res.json({ msg: "Welcome to the protected route!", user: req.user });
});

module.exports = router;
