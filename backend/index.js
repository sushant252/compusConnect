const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { protect, adminOnly } = require("./middleware/authMiddleware");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("CampusConnect Backend is Running!");
});
// Authentication Routes
app.use("/api/auth", authRoutes);
// Company Routes
app.use("/api/companies", companyRoutes);
// Job Routes
app.use("/api/jobs", jobRoutes);
// Application Routes
app.use("/api/applications", applicationRoutes);
// interview Routes
app.use("/api/interviews", interviewRoutes);
// Anoucement
app.use("/api/announcements", announcementRoutes);
// Notification Routes
app.use("/api/notifications", notificationRoutes);
// Profile Routes
app.use("/api/profile", profileRoutes);
// 
app.use("/api/admin", adminRoutes);
// 
app.get("/api/admin/test", protect, adminOnly, (req, res) => {
    res.json({
        message: "Welcome Admin! Admin access granted."
    });
});

// Connect Database and Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();