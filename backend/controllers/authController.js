
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Student Registration
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            enrollmentNumber,
            branch,
            cgpa,
            graduationYear
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create student
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            enrollmentNumber,
            branch,
            cgpa,
            graduationYear,
            role: "student"
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email or enrollment number already exists"
            });
        }

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};

// Student Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user and include hidden password field
        const user = await User.findOne({
            email: email.toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};


const getMe = async (req, res) => {
    try {
        res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                phone: req.user.phone,
                enrollmentNumber: req.user.enrollmentNumber,
                branch: req.user.branch,
                cgpa: req.user.cgpa,
                graduationYear: req.user.graduationYear,
                skills: req.user.skills,
                resume: req.user.resume
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch profile"
        });
    }
};

module.exports = { 
    registerUser,
     loginUser,
     getMe
     };