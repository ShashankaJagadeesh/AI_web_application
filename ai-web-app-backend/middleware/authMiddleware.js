// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Access Denied. No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.status(403).json({ msg: "Invalid Token" });
    }

    console.log("Decoded token:", decoded); // Debug log 
    if (!decoded.userId) {
      return res.status(403).json({ msg: "User ID missing in token" });
    }

    req.user = { id: decoded.userId };
    next();
  });
};

module.exports = authenticateToken;
