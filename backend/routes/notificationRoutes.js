
const express = require("express");
const router = express.Router();

const {
    createNotification,
    getMyNotifications,
    markNotificationAsRead
} = require("../controllers/notificationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin: Send notification to student(s)
router.post("/", protect, adminOnly, createNotification);

// Student: View own notifications
router.get("/my", protect, (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students can view their notifications"
        });
    }
    next();
}, getMyNotifications);

// Student: Mark notification as read
router.put("/:id/read", protect, (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students can mark notifications as read"
        });
    }
    next();
}, markNotificationAsRead);

module.exports = router;
