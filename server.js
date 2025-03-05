const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Sequelize } = require("sequelize"); 

//Importing SQL DB connection
const sequelize = require("./config/database");

// Importing routes
const authRoutes = require("./routes/auth"); 
const authMiddleware = require("./middleware/authMiddleware");
const aiRoutes = require("./routes/ai");
const protectedRoutes = require("./routes/protected");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
    res.send("AI-Powered Web App Backend Running with MySQL!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", protectedRoutes);

// Used for Debugging Sequelize Connection
console.log(typeof sequelize); // Should print "object"
console.log(sequelize instanceof Sequelize); // Should print "true"

// Below code is to Sync Database
sequelize.sync({ force: false }) // "force: false" prevents overwriting tables
    .then(() => console.log("MySQL Database Synchronized"))
    .catch(err => console.error("Database Sync Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


