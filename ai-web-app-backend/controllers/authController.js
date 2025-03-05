const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 


const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ msg: "Email already registered" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ msg: "User registered successfully", userId: newUser.id });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ msg: "Server error during registration" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Debugging Log
        console.log("Login Attempt - Received Email:", email);
        console.log("Login Attempt - Received Password:", password);

        // Check if email exists
        if (!email) {
            return res.status(400).json({ msg: "Email is required" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log("User Not Found:", email);
            return res.status(400).json({ msg: "User not found" });
        }

        console.log("User Found:", user.email);

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Invalid Password Attempt for:", email);
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        console.log("Password Match - Generating Token");

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("Token Generated:", token);

        res.json({ token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ msg: "Server error during login" });
    }
};

module.exports = { registerUser, loginUser };
